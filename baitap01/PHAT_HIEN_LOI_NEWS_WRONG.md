# Báo cáo lỗi `news_wrong.html`

File được khảo sát: `baitap01/news_wrong.html`.
File đối chiếu: `baitap01/news.html`.

## Các lỗi phát hiện

| STT | Dòng | Lỗi | Cách sửa |
|---:|---:|---|---|
| 1 | 1 | Doctype viết `<!DOCTYPE HTML5>`. `HTML5` không phải tên doctype hợp lệ; cách khai báo chuẩn là `<!DOCTYPE html>`. | Đổi thành `<!DOCTYPE html>`. |
| 2 | 5 | Giá trị charset là `UTF-88`, không phải bộ mã hợp lệ. | Đổi `charset="UTF-88"` thành `charset="UTF-8"`. |
| 3 | 6 | Thẻ `<title>` chưa được đóng trước khi bắt đầu thẻ `<link>`. | Thêm `</title>` sau `Website Template`. |
| 4 | 9 | Thẻ mở `<boby>` bị gõ sai tên. | Đổi thành `<body>`. |
| 5 | 19 | Thẻ ảnh logo thiếu thuộc tính `alt`. Điều này làm giảm khả năng truy cập và khác với bản chuẩn. | Thêm `alt="LOGO"`. |
| 6 | 24 | Thẻ `<input type="submit">` thiếu dấu `>` kết thúc thẻ. | Thêm `>` sau `class="btn"`. |
| 7 | 27 | Đóng `</section>` trong khi thẻ tương ứng được mở ở dòng 11 là `<div id="header">`. | Đổi `</section>` thành `</div>`. |
| 8 | 33 | Thuộc tính `class` mở bằng dấu nháy kép nhưng đóng bằng dấu nháy đơn: `class="time'`. | Đổi thành `class="time"`. |
| 9 | 34 | Dùng thẻ `<h7>`, không phải cấp heading HTML hợp lệ. Bản chuẩn dùng `<h3>`. | Đổi cặp `<h7>...</h7>` thành `<h3>...</h3>`. |
| 10 | 43-45 | Đoạn `<p>` của tin thứ hai không có thẻ đóng `</p>` trước thẻ liên kết. | Thêm `</p>` sau nội dung đoạn văn. |
| 11 | 53 | Liên kết “Read more >>” của tin thứ ba thiếu thẻ đóng `</a>`. | Thêm `</a>` ở cuối liên kết. |
| 12 | 71 | Danh sách được mở bằng `<ul id="list">` nhưng lại đóng bằng `</ol>`. | Đổi `</ol>` thành `</ul>`. |

## Nhận xét về lỗi phát sinh

Các lỗi thiếu thẻ đóng ở trên làm trình phân tích HTML bị lệch cấu trúc và sinh thêm cảnh báo như thiếu `</span>`, thiếu `</li>`, thiếu `</ul>` hoặc tự chèn thẻ. Đây là hậu quả của lỗi cú pháp trước đó, không phải các lỗi độc lập trong mã nguồn.

Sau khi sửa 12 lỗi gốc và giữ nguyên nội dung còn lại, cấu trúc file sẽ khớp với `news.html` ở các phần bị cố ý làm sai.