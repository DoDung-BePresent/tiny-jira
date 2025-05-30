import type { Issue } from '@/types/issue';

export const calculateNewPosition = (
  issues: Issue[],
  droppedIndex: number,
): number => {
  const prevIssue = droppedIndex > 0 ? issues[droppedIndex - 1] : null;
  const nextIssue =
    droppedIndex < issues.length - 1 ? issues[droppedIndex + 1] : null;
  let newPosition;

  if (!prevIssue && !nextIssue) {
    // Nếu đây là issue duy nhất trong cột
    newPosition = 1;
  } else if (!prevIssue && nextIssue) {
    // Nếu kéo vào vị trí đầu tiên
    newPosition = nextIssue.listPosition - 1;
  } else if (!nextIssue && prevIssue) {
    // Nếu kéo vào vị trí cuối cùng
    newPosition = prevIssue.listPosition + 1;
  } else if (prevIssue && nextIssue) {
    // Nếu kéo vào giữa hai issue
    newPosition =
      prevIssue.listPosition +
      (nextIssue.listPosition - prevIssue.listPosition) / 2;
  }

  return newPosition ?? issues.length + 1;
};
