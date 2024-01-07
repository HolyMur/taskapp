"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteCard } from "./schema";
import { InputType, ReturnType } from "./types";
import {redirect} from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Пользователь не авторизован.",
    };
  }

  const { id, boardId } = data;
  let card;

  try {

    const card = await db.card.delete({
      where:{
        id,
        list:{
          board:{
            orgId
          }
        }
      }
    })
    
    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE,
    })

  } catch (error) {
    return {
      error: "Невозможно удалить данные."
    }
  }

  revalidatePath(`/board/${boardId}`);
  return {data: card}
};

export const deleteCard = createSafeAction(DeleteCard, handler);