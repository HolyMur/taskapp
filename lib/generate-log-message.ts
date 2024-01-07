import { ACTION, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case ACTION.CREATE:
      return `Создана ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.UPDATE:
      return `Обновлена ${entityType.toLowerCase()} "${entityTitle}"`;
    case ACTION.DELETE:
      return `Удалена ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `Неизвестное действие ${entityType.toLowerCase()} "${entityTitle}"`;
  };
};