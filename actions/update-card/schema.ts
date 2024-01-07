import { z } from "zod";

export const UpdateCard = z.object({
  boardId: z.string(),
  description: z.optional(
    z.string({
      required_error: "Описание обязательно.",
      invalid_type_error: "Описание обязательно.",
    }).min(3, {
      message: "Описание слишком короткое.",
    }),
  ),
  title: z.optional(
    z.string({
      required_error: "Заголовок обязателен.",
      invalid_type_error: "Заголовок обязателен.",
    }).min(3, {
      message: "Заголовок слишком короткий.",
    })
  ),
  id: z.string(),
});