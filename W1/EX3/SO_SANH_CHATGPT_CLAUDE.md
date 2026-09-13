# So sánh kết quả ChatGPT và Claude Code trong EX3

## 1. Phạm vi so sánh

- **Bản ChatGPT:** `ChatGpt/lexi-english-landing-page (1).html`
- **Bản Claude Code:** `index.html`, `styles.css`, `app.js`
- **Cơ sở đánh giá:** đọc mã nguồn, đối chiếu các tính năng trong yêu cầu và đối chiếu với `AI_LOG.md` của EX3.

## 2. Tóm tắt kết quả

| Tiêu chí | ChatGPT | Claude Code |
|---|---|---|
| Cấu trúc | Một file HTML chứa cả CSS và JavaScript | Tách thành HTML, CSS và JavaScript |
| Tên sản phẩm | Lexi | Lumen |
| Dữ liệu ban đầu | Không có từ mẫu, trạng thái bắt đầu rỗng | Tự tạo 3 từ mẫu khi IndexedDB chưa có dữ liệu |
| Phong cách UI | Tối giản, dark-first, thiên về trang ứng dụng đơn | Dashboard học tập có sidebar, bento grid và nhiều trạng thái hiển thị |
| Lưu trữ | IndexedDB cho từ vựng, LocalStorage cho theme, ghi chú, tiến độ | IndexedDB cho từ vựng, LocalStorage cho theme, ghi chú và streak |
| Ôn tập | SM-2 đầy đủ hơn, hiển thị khoảng ngày dự kiến | Có spaced repetition tương tự SM-2, kèm lịch sử từng lần ôn |
| Điều hướng | Thanh điều hướng ngang ở đầu trang | Sidebar trên desktop, chuyển thành thanh điều hướng trên mobile |
| Tính mở rộng | Khó bảo trì khi file tiếp tục lớn | Dễ đọc, sửa và mở rộng hơn nhờ tách trách nhiệm |

**Kết luận ngắn:** ChatGPT tạo ra một prototype độc lập, gọn và đủ nhiều tính năng trong một file. Claude Code tạo ra một ứng dụng hoàn chỉnh hơn về trải nghiệm sử dụng, tổ chức mã nguồn và khả năng phát triển tiếp.

## 3. Khác biệt về kiến trúc và tổ chức mã nguồn

### ChatGPT

- Toàn bộ HTML, CSS, IndexedDB, thuật toán SM-2, điều hướng và xử lý sự kiện nằm trong một file.
- Ưu điểm là chỉ cần mở một file là có thể xem toàn bộ ứng dụng và chạy trực tiếp bằng `file://`.
- Nhược điểm là file dài, các phần giao diện và logic phụ thuộc chặt vào nhau. Khi thêm tính năng, việc tìm và kiểm thử phần bị ảnh hưởng sẽ khó hơn.
- Sử dụng các hàm toàn cục như `showSection`, `startStudy`, `renderWords`, `renderProgress`, phù hợp với prototype nhưng chưa tối ưu cho dự án lớn.

### Claude Code

- `index.html` chịu trách nhiệm về cấu trúc, `styles.css` chịu trách nhiệm về giao diện, còn `app.js` xử lý dữ liệu và tương tác.
- Ranh giới giữa các phần rõ hơn, thuận tiện cho việc thay đổi giao diện mà ít ảnh hưởng đến logic.
- Có các hàm tập trung cho những nhóm hành vi như `renderAll`, `renderToday`, `renderWords`, `renderPractice` và `renderProgress`.
- Đây là cấu trúc phù hợp hơn với yêu cầu phát triển nhiều vòng trong `AI_LOG.md`.

**Đánh giá:** Claude Code tốt hơn về khả năng bảo trì và mở rộng; ChatGPT tốt hơn về tính đơn giản khi chia sẻ một file độc lập.

## 4. Khác biệt về giao diện và trải nghiệm người dùng

### ChatGPT

- Dùng giao diện dark-first với token màu, không dùng shadow và dùng border để tạo phân cấp.
- Có header sticky, navigation ngang và các card theo grid.
- Trang Hôm nay dùng bento grid đơn giản; bố cục dễ hiểu nhưng cảm giác giống một trang công cụ tổng quát.
- Có chế độ sáng/tối theo `prefers-color-scheme` và cho phép ghi đè thủ công.
- Flashcard lớn, có nút loa và ba nút đánh giá.
- Có trạng thái rỗng cho danh sách từ và trạng thái chưa có dữ liệu cho các bài luyện tập.

### Claude Code

- Giao diện Lumen có định hướng sản phẩm rõ hơn: sidebar, khu vực thương hiệu, streak mini, topbar và dashboard.
- Bento grid trên màn Hôm nay làm nổi bật số từ đến hạn, số từ mới, streak và tổng số từ.
- Dùng font `DM Sans` kết hợp với monospace cho số liệu và nhãn nhỏ; hình thức nhất quán hơn với ứng dụng học tập.
- Có skeleton loading, toast, progress bar phiên học, trạng thái focus-visible và hỗ trợ giảm chuyển động.
- Responsive được xử lý ở desktop, tablet và mobile; sidebar chuyển thành thanh điều hướng ngang trên màn hình nhỏ.
- Các form thêm/sửa từ dùng `<dialog>`, giúp giao diện tập trung hơn so với form inline của ChatGPT.

**Đánh giá:** Claude Code có trải nghiệm sản phẩm hoàn thiện và giàu trạng thái hơn. ChatGPT có giao diện tối giản, dễ hiểu và ít thành phần hơn.

## 5. Khác biệt về quản lý dữ liệu và spaced repetition

### ChatGPT

- Mỗi từ có các trường `repetitions`, `interval`, `easeFactor`, `nextReview`, `correctCount`, `mistakeCount`.
- Hàm `sm2()` tính lịch ôn tiếp theo theo chất lượng `0`, `3`, `5`.
- Khi trả lời đúng, ứng dụng gọi `recordProgress()` để ghi tiến độ theo ngày.
- Có thể gộp dữ liệu import theo từ tiếng Anh không phân biệt hoa thường.
- Bắt đầu với kho từ rỗng, phù hợp với người dùng muốn tự nhập dữ liệu.

### Claude Code

- Mỗi từ có thêm `dueDate`, `ease`, `reviews`, `correct`, `lapses`, `history` và `createdAt`.
- Có lịch sử từng lần ôn, nên màn Tiến độ có thể tính tổng lượt ôn, độ chính xác và số từ đã thuộc.
- Có 3 từ mẫu (`resilient`, `serendipity`, `nuance`) nếu kho dữ liệu chưa tồn tại, giúp người dùng nhìn thấy ứng dụng hoạt động ngay lần mở đầu.
- Có phím tắt `Space` để lật thẻ và phím `1/2/3` để chọn Quên/Khó/Dễ.
- Có thanh tiến độ riêng cho phiên học.

**Đánh giá:** Claude Code lưu được nhiều dữ liệu phân tích hơn và tạo trải nghiệm bắt đầu nhanh hơn. ChatGPT có cách đặt tên trường và hàm SM-2 trực tiếp, dễ đối chiếu với yêu cầu ban đầu hơn.

## 6. So sánh các tính năng chính

| Tính năng | ChatGPT | Claude Code | Nhận xét |
|---|---|---|---|
| Thêm, sửa, xoá từ | Có | Có | Cả hai đáp ứng yêu cầu; Claude dùng modal, ChatGPT dùng form trong trang. |
| Tìm kiếm | Theo từ tiếng Anh và nghĩa tiếng Việt | Theo từ tiếng Anh và nghĩa tiếng Việt | Tương đương. |
| Flashcard | Có lật thẻ, nghe phát âm, đánh giá 3 mức | Có lật thẻ, nghe phát âm, đánh giá 3 mức | Claude bổ sung phím tắt và tiến độ phiên. |
| Spaced repetition | Có SM-2 và ngày ôn tiếp theo | Có spaced repetition và lịch sử ôn | Claude phù hợp hơn cho thống kê dài hạn. |
| Màn Hôm nay | Có số đến hạn, từ mới, streak và tổng số từ | Có đủ các số liệu trên cùng bento dashboard | Claude nổi bật thông tin tốt hơn. |
| Dictation | Có modal luyện nghe và so sánh từ | Có modal luyện nghe và so sánh câu | Cả hai dùng Web Speech API; cách hiển thị kết quả khác nhau. |
| Điền từ | Có modal, phản hồi đúng/sai | Có modal, phản hồi viền và rung nhẹ | Claude có feedback trực quan hơn. |
| Tiến độ | Có biểu đồ 30 ngày và danh sách từ hay sai | Có biểu đồ, từ đã thuộc, lượt ôn và độ chính xác | Claude có bộ chỉ số phong phú hơn. |
| Import/Export | Có JSON | Có JSON | ChatGPT có ý định gộp theo từ; Claude chỉ thêm các từ chưa tồn tại. |
| Offline | IndexedDB và LocalStorage | IndexedDB và LocalStorage | Tương đương về công nghệ. |
| Trợ năng | Có nhãn ARIA ở nhiều thành phần và reduced motion | Có focus-visible, reduced motion và nhãn cho nút icon | Claude thể hiện rõ hơn ở thao tác bàn phím; cả hai vẫn có thể mở rộng trợ năng. |

## 7. Điểm mạnh và điểm hạn chế

### Điểm mạnh của ChatGPT

- Một file duy nhất, dễ sao chép, chạy thử và chia sẻ.
- Logic tính lịch SM-2 khá rõ ràng và bám sát yêu cầu.
- Có đủ các nhóm tính năng lớn ngay trong prototype: CRUD, flashcard, dictation, context, tiến độ và import/export.
- Có cơ chế gộp dữ liệu import theo từ tiếng Anh.

### Hạn chế của ChatGPT

- File đơn khối lớn, khó bảo trì và khó phân tách khi dự án phát triển.
- Không có dữ liệu mẫu nên màn hình đầu tiên có thể trống và người dùng phải thêm từ trước.
- Navigation nằm trong header nên trên desktop ít tận dụng không gian dọc hơn bản Claude.
- Một số xử lý dữ liệu import dùng các thao tác bất đồng bộ riêng lẻ rồi chờ bằng `setTimeout`, đây là cách kém chắc chắn hơn so với chờ transaction hoàn tất rõ ràng.
- Biểu đồ tiến độ ghi nhận số lượt trả lời đúng, nên chưa chắc tương ứng hoàn toàn với số từ duy nhất đã thuộc trong ngày.

### Điểm mạnh của Claude Code

- Tách file rõ ràng, phù hợp với phát triển và kiểm thử từng phần.
- Giao diện có nhận diện sản phẩm và hệ thống layout nhất quán hơn.
- Có dữ liệu mẫu, skeleton loading, toast, keyboard shortcut và progress bar.
- Lưu `history`, `reviews`, `correct` và `lapses`, hỗ trợ màn Tiến độ có nhiều thông tin hơn.
- Có responsive, focus-visible và reduced-motion được rà soát trong các bước chỉnh sửa của `AI_LOG.md`.

### Hạn chế của Claude Code

- Streak hiện được lưu khá đơn giản trong LocalStorage; sau một lần ôn, giá trị có thể chỉ được nâng lên tối thiểu `1`, chưa tính chuỗi ngày liên tiếp thực sự.
- Các chấm ngày trong khu vực “Nhịp học tuần này” đang được dựng theo trạng thái cố định, chưa phản ánh lịch sử học thật.
- Import chỉ thêm các từ chưa tồn tại; dữ liệu mới của một từ trùng có thể không cập nhật bản ghi cũ như cách merge của bản ChatGPT.
- Việc seed dữ liệu mẫu giúp demo tốt nhưng có thể gây bất ngờ nếu người dùng muốn bắt đầu với kho hoàn toàn rỗng.
- Mã JavaScript vẫn dùng nhiều hàm toàn cục và template HTML, nên dù đã tách file nhưng chưa phải kiến trúc module hoàn toàn.

## 8. Kết luận và đề xuất

Nếu mục tiêu là **demo nhanh, một file dễ gửi và dễ chạy**, bản ChatGPT là lựa chọn phù hợp.

Nếu mục tiêu là **một ứng dụng có trải nghiệm hoàn chỉnh, giao diện rõ ràng và có nền tảng để phát triển tiếp**, bản Claude Code tốt hơn ở thời điểm hiện tại.

Hướng tốt nhất là giữ phần giao diện, tổ chức mã nguồn và trạng thái tương tác của Claude Code, đồng thời tham khảo các điểm mạnh của ChatGPT:

1. Làm streak dựa trên lịch sử ngày học thực tế.
2. Cải thiện import để merge bản ghi trùng thay vì chỉ bỏ qua.
3. Chờ transaction IndexedDB hoàn tất rõ ràng trong mọi thao tác import/export.
4. Quyết định rõ ứng dụng nên bắt đầu bằng dữ liệu mẫu hay kho rỗng, có thể thêm tùy chọn xóa dữ liệu mẫu.
5. Định nghĩa lại biểu đồ “từ đã thuộc” để phân biệt số từ duy nhất với số lượt trả lời đúng.

**Đánh giá tổng thể:**

- **ChatGPT:** tốt về độ đầy đủ của prototype và khả năng chạy độc lập.
- **Claude Code:** tốt hơn về UI/UX, tổ chức mã nguồn, phản hồi tương tác và khả năng mở rộng.
