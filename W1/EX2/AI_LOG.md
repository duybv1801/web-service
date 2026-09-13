# AI Log - EX2

> Nhật ký xây dựng trang giới thiệu cá nhân dạng card trong `W1/EX2`.

## 1. Tạo trang giới thiệu cá nhân

### Prompt
```text
Tạo một trang HTML+CSS giới thiệu cá nhân dạng card, có ảnh đại diện hình tròn,
tên, chuyên ngành, danh sách 3 kỹ năng dạng badge, và 2 icon mạng xã hội. Dùng
màu chủ đạo xanh navy.
```

### Kết quả
Tạo trang giới thiệu cá nhân dạng card với ảnh đại diện hình tròn, tên, chuyên ngành, danh sách kỹ năng dạng badge và hai liên kết mạng xã hội. Giao diện sử dụng màu chủ đạo xanh navy và có bố cục responsive cơ bản.

### Chỉnh sửa
Tạo hai file:

- `index.html`: cấu trúc card, nội dung hồ sơ, ảnh đại diện, badge kỹ năng và icon LinkedIn/GitHub.
- `styles.css`: màu navy, typography, card layout, trạng thái tương tác và responsive mobile.

### Lý giải
Tách HTML và CSS giúp nội dung dễ chỉnh sửa, đồng thời giữ phần trình bày độc lập. Card đơn trung tâm phù hợp để chia sẻ trên mạng xã hội hoặc gửi kèm CV.

## 2. Cập nhật thông tin cá nhân

### Prompt
```text
đổi avatar thành hình avatar.jpeg, tên tôi là Bùi Văn Duy, Software Engineer, kỹ năng có Design System, ML/DL. trang giới thiệu cá nhân dạng card dùng
để chia sẻ trên mạng xã hội hoặc gửi kèm CV, bao gồm
ảnh đại diện, tên, ngành học: kỹ thuật máy tính, kỹ năng và liên kết mạng
xã hội.
• Responsive cơ bản (hiển thị tốt trên cả desktop và
mobile)
```

### Kết quả
Cập nhật card để dùng ảnh `avatar.jpeg`, hiển thị tên Bùi Văn Duy, nghề nghiệp Software Engineer, ngành học Kỹ thuật máy tính, hai kỹ năng Design System và ML/DL, cùng các liên kết LinkedIn và GitHub. Bố cục responsive tiếp tục hỗ trợ desktop và mobile.

### Chỉnh sửa
- Đổi nguồn ảnh từ URL bên ngoài sang `avatar.jpeg`.
- Đổi tên, tiêu đề nghề nghiệp và alt text của ảnh.
- Thêm dòng ngành học Kỹ thuật máy tính.
- Thay danh sách kỹ năng bằng Design System và ML/DL.
- Cập nhật mô tả cá nhân phù hợp với hồ sơ kỹ thuật.

### Lý giải
Dùng ảnh cục bộ giúp trang không phụ thuộc vào dịch vụ avatar bên ngoài và phù hợp khi gửi kèm CV. Thông tin hiển thị được cập nhật theo hồ sơ thật, trong khi CSS responsive hiện có đã đáp ứng yêu cầu trên màn hình desktop và mobile.
