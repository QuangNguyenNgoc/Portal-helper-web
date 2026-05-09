Trọng tâm của bài này không phải sửa code, mà là **nhìn ra cấu trúc thật của file**, thấy nó đang làm đúng gì, đang dồn quá nhiều gì, và vì sao nó “ổn để demo” nhưng “chưa ổn để làm nền codebase”


## Phân tích

Khi phân tích một file code web thực tế, nên phân tích thành 5 lớp:
- Lớp 1: **mô hình dữ liệu của ứng dụng** - Nó đóng vai trò cho câu hỏi "lớp này quản lí các thực thể nào?"
Ví dụ:
```ts
type NavId = "dashboard" | "builder" | "plans" | "settings";
type ConstraintMode = "prefer" | "avoid";
type BuilderTool = ConstraintMode | "erase";
type ConstraintMap = Record<string, ConstraintMode>;
type PlanId = "A" | "B" | "C";
```

- Lớp 2: **dữ liệu tĩnh và cấu hình ban đầu** - phần mô phỏng backend hoặc domain config. Không phải là UI, không phải là logic, mà là "nội dung thế giới" mà UI sẽ hiển thị. Ở prototype, pahanf này thường rất to vì chưa có API thật.
Ví dụ:
```ts
type NavId = "dashboard" | "builder" | "plans" | "settings"; // luật

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "builder", label: "Schedule Builder" },
]; // dữ liệu cụ thể theo luật đó
```

- Lớp 3: **logic thuần, không dính UI** - (nhóm quan trọng nhất để học là `buildSummary`, `getRangeCells`, `describeRange`) hàm thuần càng nhiều thì codebase càng dễ test, dễ tái sử dụng, dễ refactor.
Ví dụ:
```ts
function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
```
- Lớp 4: **component nhỏ, thiên về presentational** - những component này chủ yếu nhận props rồi render. Chúng chưa hoàn toàn "ngố" theo nghĩa chỉ present UI, nhưng nhìn chúng khá gần với nhóm reusable UI blocks. -> nên tách sớm khi refactor vì chúng có trách nhiệm rõ ràng.
Ví dụ:
```ts
function SummaryChip({ item }: { item: SummaryChipItem }) {
  const tone =
    item.state === "prefer"
      ? "border-blue-200 bg-blue-50 text-blue-900"
      : "border-rose-200 bg-rose-50 text-rose-900";
  return (
    <div className={`rounded-2xl border px-3 py-3 text-sm ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">{item.label}</div>
        <Badge
          variant="secondary"
          className="rounded-full bg-white/80 text-inherit"
        >
          {item.count} slots
        </Badge>
      </div>
    </div>
  );
}
```
- Lớp 5:**view / screen-level components** - những khối lớn mang meaning sản phẩm. Không phải component nhỏ, mà là các vùng chức năng thực thụ. Nên tách thành một `views/` để quản lí khối này.
(ví dụ `BuilderView`)

- Lớp cuối: **root container** - duy nhất, ghép tất cả lại: giữ state chính, tính `summaryItems`. Điều hướng giữa các view (screen layer), chạy generation flow, truyền props xuống các view. Đóng vai trò là "orchestration" - có cần điểm lưu ý là "nhạc trưởng" này đang ôm quá nhiều!

(Phụ lục: (1))
## Đánh giá
Một prototype tốt là prototype giúp ta chứng minh được product flow. Code hiện tại thể hiện được điều đó:
chọn ràng buộc ở Builder -> sinh plan -> chuyển sang Generated Plans, mở detail, compare nhiều plan, rồi đi đến primary + backup decision. Root container đang render điều kiện theo `activeNav`, còn `RightTail` cũng thay đổi ngữ cảnh builder hoặc plans.

- Vấn đề là, để thỏa là một architecture thì cần trả lời các câu hỏi thêm:
	- Khi sửa một vùng, thì vùng khác ko bị "phá".
	- Khi muốn thay mock data thành API thật, thì ta không cần phải xé đôi cả file
	- Khi muốn sửa selection model của Builder thì không phải lội qua logic generation của Plans. 
-> 3 vấn đề của file hiện tại: file monolithic, orchestration lẫn trong effect, và responsive assumptions chưa hợp laptop-first.

### tham chiếu code thực tế
#### 1. File đang monolithic, gom quá nhiều concern vào một nơi
- Toàn bộ app đang nằm trong một file, gồm tất cả các "lớp" kể trên. Đương nhiên sẽ refactor sau. Một số điểm đáng lưu tâm:
	- Xem phụ lục (1)
	- `PlansView` và `RightRail` không nhận dữ liệu plan ngoài mà đọc trực tiếp generatedPlans.
	- BuilderView nhận prop list khá dài, tương tự PlansView.

#### 2. Orchestration đang lẫn trong useEffect, chưa tách thành flow/use case riêng
- `useEffect` trong `BuilderView` ở `src/PortalHelperRefinedFlow.tsx (line 1003)` không chỉ “đồng bộ side effect”, mà còn chứa logic nghiệp vụ kết thúc drag: tính cells, mutate constraints theo tool, rồi reset drag state.
- `useEffect` ở root tại `src/PortalHelperRefinedFlow.tsx (line 2086)` đang mô phỏng cả flow generate: set progress, đổi status text theo từng bước, set result, bật banner, đổi nav sang "plans", rồi reset lại state.
- `handleGenerate` ở `src/PortalHelperRefinedFlow.tsx (line 2143)` chỉ bật cờ generating; phần logic chính lại nằm trong effect. Kiểu này khiến luồng nghiệp vụ bị phân mảnh: event handler mở đầu, `useEffect` thực thi, timeout kết thúc. Về architecture, đây là dấu hiệu orchestration chưa được gom vào custom hook hoặc service riêng như `useScheduleGenerationFlow`.

#### 3. Responsive có nhiều giả định cứng, chưa cho thấy laptop-first thực thụ.
- Layout gốc hiện tại chỉ bung thành 3 cột. Dẫn tới việc có vài khung hình sẽ chuyển thành 1 cột, qua demo thấy ổn. Nhưng vẫn phải tăng tính Responsive lên. 
- Đáng chú ý ở phần Right rail chỉ sticky ở xl. một số màn hình sẽ mấy summary/generate panel.
- Grid của timetable dùng kích thước cứng, tổng chiều ngang tối thiểu lớn, nhưng container cha chỉ overflow-hidden -> nguy cơ chật và nén layout.
- tương tự compare table,.... chữa cháy bằng `overflow-x-atuo`.
- Nhiều layout quan trọng chỉ chuyển sang multi-column ở xl hoặc 2xl.

#### kết luật
- Về **monolithic**, kiến trúc chưa đạt vì một file đang ôm cả model, static data, helper, view component, container state và app orchestration.
- Về **orchestration**, kiến trúc chưa đạt vì flow generate và drag interaction đang được điều phối trực tiếp trong useEffect, chưa tách thành hook/service/use-case riêng.
- Về **responsive**, kiến trúc chưa đạt vì layout chính và các panel quan trọng chỉ tối ưu từ xl/2xl, trong khi nhiều grid dùng width cứng và fallback bằng scroll ngang, nên chưa thể hiện laptop-first rõ ràng.

## Giải pháp: từ phân tích đến phân loại
### 1. Domain model
`Plan`, `ConstraintMap`, `GridCell`, `SummaryChipItem`, `GeneratedResult`
-> mô tả "đối tượng nghiệp vụ". file : `types.ts`.
=> Type là tài liệu kiến trúc. Chỉ cần đọc `Plan`, ta biết `PlansView` sẽ phải hiện thị gì... nó còn thể hiểu là "đang thiết kế ngược UI".

### 2. Static config/ mock data
`generatedPlans`, `courses`, `quickPresets`, `initialConstraints`, `navItems`
-> dữ liệu khởi tạo. Ko nên ở chung với component. file: `data/mock.ts` hoặc `config.ts`. 
=> "Mock data càng dài, component càng dễ thành file có logic kèm database giả". Chỉ đóng vai trò giai đoạn tạm.

### 3. Pure logic
`buildSummary` đang biến `constraints` thành các rule summary có thể render ở rail. Đây là logic đáng tôn trọng vì nó không cần React để chạy. Phân tích khác về `getRangeCells`, `desscribeRange`.
=> Nếu ko cần `useState`, `useEffect`, không cần DOM -> nó là "hàm thuần cần tách ra khỏi component". 

### 4. Presentational components
`SummaryChip`, `CourseCard`, `ScoreBar`, `MiniWeek`, `CompareRow` là nhóm component “trình bày trước, logic ít.
=> Xác định component thiên về render, thiên về điều phối. `PlanListCard` là ví dụ rất tốt của loại nằm ở giữa.

### 5. Screen-level views
`BuilderView`, `PlansView`, `RightRail`, `DashboardView`, `SettingsView` là tầng product-facing
=> nếu một component có thể được gọi tên như một “màn” hoặc “khu chức năng” trong cuộc họp product, thì thường nó là screen/view component, không nên nhét chung vào thư mục components nhỏ về lâu dài.

### 6. Root orchestration
`PortalHelperRefinedFlow` là “đầu não” của feature. Nó giữ `activeNav`, `tool`, `constraints`, `activePlanId`, `comparedPlanIds`, các preference toggle, trạng thái generation, và tính `summaryItems` bằng `useMemo`

## Phụ lục
### 1. Tham chiếu từ các lớp từ file gốc
```bash
src/PortalHelperRefinedFlow.tsx (line 38), 
src/PortalHelperRefinedFlow.tsx (line 95), 
src/PortalHelperRefinedFlow.tsx (line 499), 
src/PortalHelperRefinedFlow.tsx (line 784), 
src/PortalHelperRefinedFlow.tsx (line 2064),
src/PortalHelperRefinedFlow.tsx (line 2064) (vị nhạc trưởng mệt mỏi!)
```

