Khác với nội dung 1 - tập trung phân tích cấu trúc, thì phần 2 tập trung theo dõi "dòng chạy" trong file. Hiện tại app được phân thành 3 state: **app state**, **interaction state**, và **derived state**.
## 1. App state
App state là trạng thái định nghĩa “ứng dụng hiện đang ở đâu và đang làm gì”. Nó không chỉ phục vụ một animation ngắn hay một hover. Nó ảnh hưởng trực tiếp tới product flow.

app state: `activeNav`, `tool`, `constraints`, `activePlanId`, `comparedPlanIds`, `fewerStudyDays`, `closeGapClasses`, `friendMatch`, `generating`, `generationProgress`, `generationStatusText`, `generatedResult`, `showGeneratedBanner`, `pendingRuleCount`
## 2. Interaction state
Interaction state là trạng thái sinh ra để phục vụ một thao tác UI cụ thể, ngắn hạn. Nó không định nghĩa trạng thái lâu dài của sản phẩm.
`BuilderView`, `dragStart`, `dragCurrent`, `hoveredCell`

## 3. Derived state
Derived state là dữ liệu có thể tính được từ state gốc và props hiện có. Nó không nên được lưu như một `useState` riêng nếu không cần thiết.

`summaryItems` là derived state vì nó được tính từ `constraints` bằng `buildSummary`. `previewCells`, `previewKeys`, `previewInfo` là derived từ `dragStart` và `dragCurrent`. `preferCount`, `avoidCount` là derived từ `constraints`. `comparedPlans` là derived từ `comparedPlanIds` và `generatedPlans`. `compareColumns` cũng là derived tiếp từ `comparedPlans`


Biến này có định nghĩa trạng thái lâu dài của sản phẩm không? Nếu có, nghiêng về app state.

Biến này chỉ tồn tại trong lúc người dùng đang thao tác không? Nếu có, nghiêng về interaction state.

Biến này có tính lại được từ dữ liệu khác không? Nếu có, nghiêng về derived state.