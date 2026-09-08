import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const ErrorState = ({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  isRetrying = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {onRetry && (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-5 cursor-pointer"
        >
          {isRetrying ? (
            <>
              <Spinner data-icon="inline-start" />
              Retrying...
            </>
          ) : (
            "Try again"
          )}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
