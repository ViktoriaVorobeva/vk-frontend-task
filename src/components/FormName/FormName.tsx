import {
  Panel,
  PanelHeader,
  Group,
  Button,
  FormItem,
  CellButton,
  Text,
  Spinner,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FormProps, NameRequest } from "../../types";
import { DELAY, NAME_URL, PATTERN } from "../../utils/constants";
import {
  getResultFromLocalStorage,
  saveResultInLocalStorage,
} from "../../utils/localStorage";
import { request } from "../../utils/api";

export const FormName: React.FC<FormProps> = ({ id, setActivePanel }) => {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isInvalid, setInvalid] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    setInvalid(false);

    if (!PATTERN.test(name)) {
      setInvalid(true);
      return;
    }

    if (abortController) {
      abortController.abort();
    }

    setLoading(true);
    setError(false);

    const controller = new AbortController();
    setAbortController(controller);

    const { names } = getResultFromLocalStorage("names");

    if (name in names) {
      setError(false);
      setAge(names[name]);
    } else {
      try {
        const signal = controller.signal;

        const data = await request<NameRequest>(`${NAME_URL}?name=${name}`, {
          signal,
        });

        if (!data) {
          throw new Error("not found age");
        }

        const { age } = data;

        if (age === null) {
          setNotFound(true);
        } else {
          setAge(age);
          saveResultInLocalStorage("names", {
            names: { ...names, [name]: age },
          });
        }
      } catch {
        setError(true);
      }
    }
    setAbortController(null);
    setLoading(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      onSubmitHandler({ preventDefault: () => {} } as FormEvent);
    }, DELAY);
    return () => {
      clearTimeout(timerId);
    };
  }, [name]);

  return (
    <Panel id={id}>
      <PanelHeader>Get age</PanelHeader>
      <Group>
        <form onSubmit={onSubmitHandler}>
          <FormItem top="Имя" htmlFor="name">
            <input
              onChange={onChange}
              value={name}
              id="name"
              type="text"
              placeholder="Введите имя"
            />
          </FormItem>
          <FormItem>
            <Button type="submit">Get age</Button>
          </FormItem>
        </form>
        {!isError && !isLoading && age && (
          <Text>
            {name}'s age is {age}
          </Text>
        )}
        {isError && (
          <Text>
            Произошла ошибка! Обновите страницу/попробуйте отправить запрос
            позже
          </Text>
        )}
        {notFound && !age && <Text>For {name} age is not found</Text>}
        {isInvalid && !age && <Text>You can only use letters</Text>}
        {isLoading && <Spinner size="regular" />}
      </Group>
      <CellButton onClick={() => setActivePanel("facts")}>
        Return to facts panel
      </CellButton>
    </Panel>
  );
};
