import {
  Panel,
  PanelHeader,
  Group,
  Button,
  FormItem,
  Textarea,
  CellButton,
  Text,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import React, { FormEvent, useRef, useState } from "react";
import { FactRequest, FormProps } from "../../types";
import { request } from "../../utils/api";
import { FACT_URL } from "../../utils/constants";

export const FormFact: React.FC<FormProps> = ({ id, setActivePanel }) => {
  const factTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [isError, setError] = useState(false);

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const data = await request<FactRequest>(FACT_URL);

      if (!data) {
        throw new Error("not found facts");
      }

      if (factTextareaRef.current) {
        factTextareaRef.current.value = data.fact;
        factTextareaRef.current.focus();

        const spaceIndex = factTextareaRef.current.value.indexOf(" ");
        const focusPosition =
          spaceIndex !== -1
            ? spaceIndex + 1
            : factTextareaRef.current.value.length;
        factTextareaRef.current.setSelectionRange(focusPosition, focusPosition);
        setError(false);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <Panel id={id}>
      <PanelHeader>Random Facts</PanelHeader>
      <Group>
        <form onSubmit={onSubmitHandler}>
          <FormItem>
            <Button type="submit">Get Random Fact</Button>
          </FormItem>
          <FormItem>
            <Textarea
              getRef={factTextareaRef}
              placeholder="Здесь появится интересный факт"
            />
          </FormItem>
        </form>
        {isError && (
          <Text>
            Произошла ошибка! Обновите страницу/попробуйте отправить запрос
            позже
          </Text>
        )}
      </Group>
      <CellButton onClick={() => setActivePanel("name")}>
        Go to panel name
      </CellButton>
    </Panel>
  );
};
