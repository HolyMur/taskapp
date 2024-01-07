"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const ListContainer = ({
  data,
  boardId,
}: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("Лист перемещен.");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Задача перемещена.");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // Проверка если отправлен в туже позицию
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Пользователь переносит лист
    if (type === "list") {
      const items = reorder(
        orderedData,
        source.index,
        destination.index,
      ).map((item, index) => ({ ...item, order: index }));

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // Пользователь переносит задачу
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // Лист начала и лист назначения
      const sourceList = newOrderedData.find(list => list.id === source.droppableId);
      const destList = newOrderedData.find(list => list.id === destination.droppableId);

      if (!sourceList || !destList) {
        return;
      }

      // Проверка существует ли задача в листе начала
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Проверка существует ли задача в листе назначения
      if (!destList.cards) {
        destList.cards = [];
      }

      // Перемещение задачи внутри одного листа
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: reorderedCards,
        });
        // Пользователь перемещает задачу в другой лист
      } else {
        // Remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Новый id list для перемещенной задачи
        movedCard.listId = destination.droppableId;

        // добавить задачу в лист назначения
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // Обновить порядок для задач в листе назначения
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          boardId: boardId,
          items: destList.cards,
        });
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return (
                <ListItem
                  key={list.id}
                  index={index}
                  data={list}
                />
              )
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};