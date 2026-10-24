import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const NotificationPagination = ({
  pagination,
  page,
  isFetching,
  setSearchParams,
}) => {
  return (
    <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Page {pagination.page} of {pagination.totalPages}
      </p>

      <Pagination className="mx-0 w-auto sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault();

                if (page > 1 && !isFetching) {
                  setSearchParams((params) => {
                    if (page - 1 === 1) {
                      params.delete("page");
                    } else {
                      params.set("page", String(page - 1));
                    }

                    return params;
                  });
                }
              }}
              className={
                page === 1 || isFetching
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {Array.from(
            { length: pagination.totalPages },
            (_, index) => index + 1,
          ).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={page === pageNumber}
                onClick={(event) => {
                  event.preventDefault();

                  if (page !== pageNumber && !isFetching) {
                    setSearchParams((params) => {
                      if (pageNumber === 1) {
                        params.delete("page");
                      } else {
                        params.set("page", String(pageNumber));
                      }

                      return params;
                    });
                  }
                }}
                className={
                  isFetching
                    ? "pointer-events-none cursor-default opacity-60"
                    : "cursor-pointer"
                }
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault();

                if (page < pagination.totalPages && !isFetching) {
                  setSearchParams((params) => {
                    params.set("page", String(page + 1));
                    return params;
                  });
                }
              }}
              className={
                page === pagination.totalPages || isFetching
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default NotificationPagination;
