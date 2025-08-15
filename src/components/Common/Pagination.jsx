import React from "react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const generatePages = () => {
    const pages = [];
    const maxVisible = 5; // Số trang hiển thị tối đa

    if (totalPages <= maxVisible) {
      // Hiển thị tất cả trang nếu ít hơn maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic phức tạp hơn cho nhiều trang
      const halfVisible = Math.floor(maxVisible / 2);
      let start = Math.max(currentPage - halfVisible, 1);
      let end = Math.min(start + maxVisible - 1, totalPages);

      // Điều chỉnh start nếu end đã đạt tối đa
      if (end - start < maxVisible - 1) {
        start = Math.max(end - maxVisible + 1, 1);
      }

      // Thêm trang đầu nếu cần
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      // Thêm các trang ở giữa
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Thêm trang cuối nếu cần
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = generatePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null; // Không hiển thị pagination nếu chỉ có 1 trang
  }

  return (
    <div className="d-flex justify-content-between align-items-center mt-4">
      {/* Page Info */}
      {showInfo && (
        <div
          className="text-muted"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
        >
          Hiển thị {startItem} - {endItem} trong tổng số {totalItems} kết quả
        </div>
      )}

      {/* Pagination Controls */}
      <nav aria-label="Pagination">
        <ul className="pagination mb-0">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          </li>

          {/* Page Numbers */}
          {pages.map((page, index) => (
            <li
              key={index}
              className={`page-item ${page === currentPage ? "active" : ""} ${
                page === "..." ? "disabled" : ""
              }`}
            >
              {page === "..." ? (
                <span className="page-link">...</span>
              ) : (
                <button
                  className="page-link"
                  onClick={() => onPageChange(page)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: page === currentPage ? "600" : "400",
                  }}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          {/* Next Button */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
