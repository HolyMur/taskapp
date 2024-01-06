import { z } from "zod";

export const CreateBoard = z.object({
    title: z.string({
        required_error: "Название доски является необходимым полем.",
        invalid_type_error: "Название доски является необходимым полем.",
    }).min(3, {
        message: "Слишком маленькое название доски."
    }),
    image: z.string({
        required_error: "Изображение обязательно.",
        invalid_type_error: "Изображение обязательно."
    })
})