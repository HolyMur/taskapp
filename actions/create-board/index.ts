"use server";

import {InputType, ReturnType} from "@/actions/create-board/types";
import {auth} from "@clerk/nextjs";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {createSafeAction} from "@/lib/create-safe-action";
import {CreateBoard} from "@/actions/create-board/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return {
            error: "Пользователь неавторизован.",
        }
    }

    const { title, image } = data;

    const [
        imageId,
        imageThumbUrl,
        imageLinkHTML,
        imageFullUrl,
        imageUserName
    ] = image.split("|")


     if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
        return {
          error: "Переданы не все поля! Невозможно создать доску."
        };
      }

    let board;

    try{
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML
            }
        })
    } catch (e) {
        return {
            error: "Невозможно создать доску."
        }
    }

    revalidatePath(`/board/${board.id}`)
    return {data: board}
}

export const createBoard = createSafeAction(CreateBoard, handler)