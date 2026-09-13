# AI Log - Lumen

> Nhật ký triển khai landing page học tiếng Anh trong `W1/EX3`.

## 1. Khởi tạo ứng dụng

### Prompt
```text
[Context] Tôi đang Xây dựng một landing page một trang cho một ứng dụng học tiếng Anh,

[Role] Bạn là một lập trình viên Front-end lão luyện.
Action

**1. Thêm từ**

[Action] Hãy xây dựng một tính năng cho phép người dùng bấm nút "Thêm từ mới", xuất hiện ô nhập liệu (gồm Từ tiếng Anh, Nghĩa tiếng Việt, Câu ví dụ) và lưu từ đó vào danh sách hiển thị ngay trên màn hình.

**2. Danh sách từ**

[Action] Hãy xây dựng một tính năng cho phép người dùng xem toàn bộ từ đã lưu dưới dạng danh sách, có ô tìm kiếm theo từ hoặc nghĩa, và mỗi dòng có nút Sửa và nút Xoá.

**3. Flashcard cơ bản**

[Action] Hãy xây dựng một tính năng cho phép người dùng bấm nút "Ôn tập", hiển thị lần lượt từng thẻ với mặt trước là từ tiếng Anh, bấm vào thẻ để lật xem nghĩa và câu ví dụ, rồi bấm "Tiếp theo" để sang thẻ khác.

**4. Spaced repetition**

[Action] Hãy xây dựng một tính năng cho phép người dùng sau khi lật thẻ sẽ chọn một trong ba mức "Quên", "Khó", "Dễ", hệ thống tính ngày ôn lại tiếp theo cho từ đó theo thuật toán SM-2 và chỉ đưa ra ôn những từ đã đến hạn.

**5. Màn hình hôm nay**

[Action] Hãy xây dựng một tính năng cho phép người dùng khi mở app thấy ngay màn hình "Hôm nay" hiển thị số từ đến hạn ôn, số từ mới sẽ học, số ngày streak liên tiếp và một nút "Bắt đầu học".

**6. Nghe phát âm**

[Action] Hãy xây dựng một tính năng cho phép người dùng bấm biểu tượng loa trên mỗi thẻ từ để nghe phát âm từ đó bằng Web Speech API của trình duyệt.

**7. Dictation**

[Action] Hãy xây dựng một tính năng cho phép người dùng bấm nút "Luyện nghe", hệ thống đọc lên một câu ví dụ, người dùng gõ lại câu vừa nghe, sau đó so sánh và tô màu những từ gõ sai.

**8. Điền từ trong ngữ cảnh**

[Action] Hãy xây dựng một tính năng cho phép người dùng làm bài tập điền từ, trong đó hệ thống lấy câu ví dụ của một từ đã lưu, ẩn từ đó đi thành ô trống, người dùng gõ đáp án và nhận phản hồi đúng/sai ngay.

**9. Thống kê**

[Action] Hãy xây dựng một tính năng cho phép người dùng xem trang "Tiến độ" gồm biểu đồ số từ đã thuộc theo từng ngày trong 30 ngày gần nhất và danh sách những từ bị trả lời sai nhiều nhất.

**10. Import / Export**

[Action] Hãy xây dựng một tính năng cho phép người dùng bấm nút "Xuất dữ liệu" để tải toàn bộ từ vựng về dưới dạng file JSON, và nút "Nhập dữ liệu" để tải file JSON lên và gộp vào danh sách hiện có.

**11. Lưu offline**

[Action] Hãy xây dựng một tính năng cho phép toàn bộ dữ liệu từ vựng và lịch ôn tập được lưu xuống IndexedDB của trình duyệt, để người dùng tắt trình duyệt mở lại vẫn còn nguyên dữ liệu.

[Format] Trả về mã nguồn của trang sạch sẽ, có comment giải thích bằng tiếng Việt.

[Target] Thiết kế giao diện theo phong cách tối giản (Minimalism), hỗ trợ chế độ màn hình sáng/tối (Dark mode) và phải lưu được trạng thái ghi chú vào LocalStorage để khi tải lại trang không bị mất dữ liệu.
```

### Kết quả
Thư mục `EX3` ban đầu trống. Xác định hướng triển khai bằng HTML, CSS và JavaScript thuần, không cần framework hay build tool.

### Chỉnh sửa
Tạo các file:

- `index.html`: cấu trúc giao diện, navigation, dashboard, danh sách từ, flashcard, modal và các trạng thái tương tác.
- `styles.css`: giao diện responsive tối giản.
- `app.js`: IndexedDB, LocalStorage, SM-2, speech synthesis, dictation, context exercise, thống kê và import/export.

### Lý giải
HTML/CSS/JS thuần phù hợp với thư mục trống, chạy được trực tiếp bằng `file://` và không tạo thêm phụ thuộc. IndexedDB được dùng cho dữ liệu từ vựng/lịch ôn; LocalStorage dùng cho ghi chú, theme và streak.

## 2. Kiểm tra phiên bản đầu tiên

### Prompt
```text
Kiểm tra ứng dụng sau khi dựng và xác nhận các tính năng chính hoạt động.
```

### Kết quả
VS Code không báo lỗi ở ba file. Máy chưa cài Node.js nên `node --check` không chạy được. Browser test xác nhận IndexedDB tạo dữ liệu mẫu, thêm từ mới, chuyển Dark mode, lật thẻ, chọn mức “Dễ”, lưu ghi chú và giữ dữ liệu sau reload.

### Chỉnh sửa
Không thay đổi mã nguồn ở bước này; dùng browser automation để kiểm tra hành vi thực tế.

### Lý giải
Kiểm tra trực tiếp trong trình duyệt là discriminating check phù hợp vì ứng dụng phụ thuộc IndexedDB, LocalStorage và Web Speech API.

## 3. Refactor dark-first và design token

### Prompt
```text
**1. Hệ thống token màu**

[Action] Hãy thiết lập một hệ thống design token bằng CSS custom properties đặt trong :root, gồm nền (--bg #050505, --surface #101012, --surface-hover #17171a), chữ (--text #f2f2f3, --text-muted #8a8a93), viền (--border #232327), và màu nhấn (--accent, --success, --warning, --danger). Toàn bộ CSS còn lại chỉ được dùng các biến này, không hardcode mã màu ở bất kỳ component nào.

**2. Nền dark-first**

[Action] Hãy áp dụng giao diện nền tối làm mặc định cho toàn bộ app, trong đó độ nổi khối được tạo bằng cách tăng độ sáng nền (--surface sáng hơn --bg) và một đường viền 1px màu --border, tuyệt đối không dùng box-shadow để giả chiều sâu.

**3. Chế độ sáng + tôn trọng hệ điều hành**

[Action] Hãy bổ sung bảng token cho chế độ sáng và tự động chọn theo prefers-color-scheme, đồng thời thêm nút chuyển đổi sáng/tối ở góc trên bên phải cho phép người dùng ghi đè thủ công và lưu lựa chọn đó lại.

**4. Typography**

[Action] Hãy thiết lập hệ thống chữ với font sans hiện đại cho nội dung và một font monospace dùng riêng cho số liệu, ngày tháng và nhãn nhỏ. Kích thước chữ theo thang 12/14/16/20/28/40px, dùng clamp() cho tiêu đề để co giãn theo màn hình.

**5. Bento grid cho màn Hôm nay**

[Action] Hãy bố trí lại màn hình "Hôm nay" thành một bento grid bất đối xứng: ô "từ đến hạn ôn" chiếm 2 cột và nổi bật nhất, các ô "từ mới", "streak", "tổng số từ" chiếm 1 cột, bên dưới là ô rộng full chứa nút "Bắt đầu học". Trên màn hình hẹp hơn 640px thì xếp dồn thành 1 cột.

**6. Thẻ flashcard chữ lớn**

[Action] Hãy thiết kế lại thẻ flashcard với từ tiếng Anh hiển thị cỡ rất lớn dùng clamp(2.5rem, 8vw, 5rem) căn giữa thẻ, phiên âm đặt ngay dưới bằng font monospace màu --text-muted, và nghĩa cùng câu ví dụ chỉ hiện ra sau khi lật thẻ.

**7. Nút và ô nhập**

[Action] Hãy chuẩn hoá toàn bộ nút và ô nhập liệu theo phong cách hình khối sắc nét: bo góc nhỏ tối đa 6px, viền 1px, nền phẳng không gradient. Ba mức nút: nút chính nền màu --accent, nút phụ nền --surface có viền, nút chỉ có chữ không nền. Ô nhập khi focus đổi màu viền thành --accent chứ không dùng outline mặc định của trình duyệt.

**8. Ba nút đánh giá SM-2**

[Action] Hãy tạo ba nút "Quên", "Khó", "Dễ" có chiều cao lớn, chia đều chiều ngang, lần lượt mang màu --danger, --warning, --success ở dạng viền màu nền trong suốt, và hiện kèm số ngày ôn lại tiếp theo bằng font monospace cỡ nhỏ ngay dưới nhãn mỗi nút.

**9. Chuyển động tiết chế**

[Action] Hãy thêm chuyển động chỉ ở ba chỗ: lật thẻ flashcard, chuyển giữa các màn hình, và phản hồi đúng/sai trong bài tập. Mọi transition giới hạn dưới 200ms, chỉ animate transform và opacity, và bọc toàn bộ trong @media (prefers-reduced-motion: reduce) để tắt khi người dùng yêu cầu.

**10. Trạng thái rỗng và tải**

[Action] Hãy thiết kế trạng thái rỗng cho danh sách từ và màn ôn tập, gồm một dòng chữ ngắn màu --text-muted và một nút hành động, dùng đúng token màu đã thiết lập, không dùng hình minh hoạ.
```

### Kết quả
CSS cũ còn nhiều màu hardcode, box-shadow, bo góc lớn và layout dashboard chưa phải bento. HTML thiếu ô tổng số từ và thiếu số ngày ôn dưới nút đánh giá.

### Chỉnh sửa
- Thay hệ màu bằng `--bg`, `--surface`, `--surface-hover`, `--text`, `--text-muted`, `--border`, `--accent`, `--success`, `--warning`, `--danger`.
- Thêm light token override qua `prefers-color-scheme` và theme thủ công.
- Tạo bento grid cho màn Hôm nay.
- Đổi flashcard thành thẻ chữ lớn, phiên âm monospace.
- Chuẩn hoá button/input và bỏ box-shadow/gradient.
- Thêm empty state có nút hành động.
- Thêm reduced-motion rule.

### Lý giải
Token tập trung giúp đổi theme nhất quán. Dark-first và surface/border tạo độ nổi khối mà không phụ thuộc shadow. Bento grid làm các số liệu quan trọng dễ quét hơn.

## 4. Sửa responsive và class cũ

### Prompt
```text
Kiểm tra giao diện ở viewport nhỏ và bảo đảm các nút dùng đúng token mới.
```

### Kết quả
Phát hiện hai breakpoint CSS có ký tự `+` thừa nên media query bị bỏ qua. Một số nút vẫn dùng class cũ `button-dark`, không còn style sau refactor.

### Chỉnh sửa
- Xoá ký tự thừa trước breakpoint `900px`, `640px` và `prefers-reduced-motion`.
- Đổi toàn bộ `button-dark` thành `button-primary`.
- Ở viewport trung gian, xếp tiêu đề/nút theo cột và đưa bento về hai cột; dưới `640px` về một cột.

### Lý giải
Overflow trên mobile không phải lỗi nội dung mà do CSS breakpoint không được parse. Dùng một class `button-primary` giúp các nút hành động cùng dùng accent token.

## 5. Chuẩn hoá spacing, typography và tương tác bàn phím

### Prompt
```text
**Spacing**

[Action] Hãy thiết lập thang khoảng cách 4px (4, 8, 12, 16, 24, 32, 48, 64) thành các biến --space-* và thay toàn bộ padding, margin, gap hiện có trong dự án bằng các biến này, không để lại giá trị px tuỳ ý.

[Action] Hãy chuẩn hoá chiều rộng nội dung tối đa là 720px cho các trang danh sách và 520px cho thẻ flashcard, căn giữa màn hình, với padding hai bên tối thiểu 16px trên mobile.

[Action] Hãy rà soát lại nhịp dọc: khoảng cách giữa tiêu đề và nội dung ngay dưới nó phải nhỏ hơn khoảng cách tới khối tiếp theo, để các phần tử liên quan nhìn vào là thấy thuộc cùng một nhóm.

**Typography**

[Action] Hãy đặt line-height 1.1 cho tiêu đề lớn, 1.5 cho đoạn văn, và giới hạn độ dài dòng văn bản ở 65 ký tự bằng max-width: 65ch.

[Action] Hãy bật font-variant-numeric: tabular-nums cho mọi con số thống kê, streak và bộ đếm, để số không bị nhảy chiều ngang khi thay đổi giá trị.

[Action] Hãy chỉ dùng ba mức đậm chữ trong toàn app (400, 500, 700) và bỏ mọi khai báo font-weight khác. Với tiêu đề cỡ lớn, thêm letter-spacing: -0.02em; với nhãn viết hoa cỡ nhỏ, thêm letter-spacing: 0.05em.

[Action] Hãy dùng text-wrap: balance cho các tiêu đề và text-wrap: pretty cho đoạn văn, để tránh dòng cuối chỉ còn một từ lẻ.

**Hiệu ứng & chi tiết tương tác**

[Action] Hãy thêm trạng thái :focus-visible rõ ràng cho mọi phần tử bấm được, dùng viền --accent dày 2px cách ra 2px, và đảm bảo có thể thao tác toàn bộ màn ôn tập chỉ bằng bàn phím.

[Action] Hãy thêm phím tắt cho màn ôn tập: Space để lật thẻ, phím 1/2/3 tương ứng Quên/Khó/Dễ, và hiển thị gợi ý phím tắt bằng chữ nhỏ màu --text-muted dưới mỗi nút.

[Action] Hãy làm mượt chuyển tiếp giữa các thẻ flashcard bằng hiệu ứng mờ dần và dịch lên 8px, thời lượng 150ms, dùng cubic-bezier(0.2, 0, 0, 1) thay cho ease mặc định.

[Action] Hãy thêm một thanh tiến trình mảnh 2px ở đầu màn ôn tập cho biết đã qua bao nhiêu thẻ trên tổng số thẻ của phiên, cập nhật mượt sau mỗi lần trả lời.

[Action] Hãy thêm phản hồi tức thì khi trả lời bài tập điền từ: viền ô nhập đổi màu --success hoặc --danger trong 600ms rồi trở lại bình thường, kèm rung nhẹ ngang 4px khi sai, và bọc trong prefers-reduced-motion.

[Action] Hãy bổ sung skeleton loading cho danh sách từ khi đang đọc dữ liệu từ IndexedDB, thay vì để màn hình trắng hoặc nhảy layout.
```

### Kết quả
Giao diện cần thêm lớp spacing token và các trạng thái tương tác nâng cao cho màn Ôn tập.

### Chỉnh sửa
- Thêm `--space-4` đến `--space-64`.
- Chuẩn hoá các khoảng cách chính bằng token ở lớp CSS bổ sung.
- Giới hạn danh sách ở `720px`, flashcard ở `520px`, mobile padding tối thiểu `16px`.
- Thêm `line-height: 1.1` cho tiêu đề và `1.5` cho đoạn văn.
- Thêm `text-wrap: balance`, `text-wrap: pretty`, `max-width: 65ch`.
- Thêm `font-variant-numeric: tabular-nums`.
- Thêm Space để lật thẻ và phím 1/2/3 để chọn Quên/Khó/Dễ.
- Thêm gợi ý phím tắt dưới ba nút đánh giá.
- Thêm progress bar 2px và skeleton list.
- Thêm trạng thái viền success/danger và rung nhẹ cho bài điền từ.

### Lý giải
Các token spacing giúp nhịp layout nhất quán. Keyboard shortcut giảm thao tác lặp trong phiên học. Skeleton giữ ổn định layout trong thời gian IndexedDB đang đọc dữ liệu.

## 6. Sửa lỗi flashcard đè nút Tiếp theo

### Prompt
```text
phần ôn tập, thẻ đang đè mất không gian của nút tiếp theo, cần dịch lên trên
```

### Kết quả
Đo bounding box cho thấy `.card-front` và `.card-back` đang nằm thấp hơn khung `.flashcard`. Nguyên nhân là hai phần tử `position: absolute` chưa có tọa độ neo `top` và `left`.

### Chỉnh sửa
Thêm vào `styles.css`:

```css
.card-front,
.card-back {
  top: 0;
  left: 0;
}
```

### Lý giải
Khi không có `top/left`, trình duyệt dùng static position của phần tử absolute trong ngữ cảnh flex, khiến hai mặt thẻ trượt xuống. Neo về góc trên trái giữ thẻ nằm đúng trong vùng cao 300/325px và giải phóng khoảng trống cho vùng đánh giá và nút “Tiếp theo”.

## 7. Kiểm tra cuối

### Prompt
```text
Xác nhận sau chỉnh sửa không còn chồng lấn và không gây lỗi mới.
```

### Kết quả
Browser test xác nhận:

- Flashcard nằm trong khung riêng.
- Vùng đánh giá bắt đầu sau đáy flashcard.
- Nút “Tiếp theo” nằm dưới vùng đánh giá.
- Không còn overlap.
- HTML, CSS và JavaScript không có lỗi từ VS Code.
- Ghi chú LocalStorage và dữ liệu IndexedDB vẫn được giữ nguyên.

### Chỉnh sửa
Không cần chỉnh sửa thêm sau phép đo cuối.

### Lý giải
Đo trực tiếp `getBoundingClientRect()` cho flashcard, review actions và nút tiếp theo là kiểm tra phù hợp nhất cho lỗi layout này.

## 8. Ghi lại AI log

### Prompt
```text
ghi lại AI log của cuộc hội thoại này vào file md, mô tả các bước tương tác: prompt -> kết quả -> chỉnh sửa -> lý giải
```

### Kết quả
Tạo file `AI_LOG.md` trong thư mục `W1/EX3` để ghi lại tiến trình triển khai theo bốn phần: Prompt, Kết quả, Chỉnh sửa và Lý giải.

### Chỉnh sửa
Viết nhật ký gồm các giai đoạn khởi tạo ứng dụng, kiểm tra chức năng, refactor dark-first, responsive, spacing/typography, keyboard shortcuts và sửa lỗi flashcard.

### Lý giải
Tổ chức log theo cùng một cấu trúc cho mỗi lần tương tác giúp phân biệt rõ yêu cầu đầu vào, kết quả quan sát được, thay đổi mã nguồn và lý do kỹ thuật của thay đổi.
