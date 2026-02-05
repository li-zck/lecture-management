export const getSuccessMessage = (
  status: number,
  fallbackMessage = "Operation completed successfully",
): string => {
  const messages: Record<number, string> = {
    200: "Request completed successfully",
    201: "Resource created successfully",
    202: "Request accepted and is being processed",
    204: "Operation completed successfully (no content returned)",
    205: "Reset content completed",
    206: "Partial content delivered successfully",
  };

  return messages[status] || fallbackMessage;
};
