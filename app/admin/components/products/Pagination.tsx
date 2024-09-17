import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {
  return (
    <div className="mt-4 flex justify-between items-center">
      <Button
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}
      >
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button
        onClick={() => setPage(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
