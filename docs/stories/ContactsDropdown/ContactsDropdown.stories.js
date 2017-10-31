import React from "react";
import { storiesOf } from "@storybook/react";
import { text, boolean, number, array } from "@storybook/addon-knobs";
import ContactsDropdown from "../../../components/ContactsDropdown";

storiesOf("ContactsDropdown", module)
    .addWithInfo("main", () => (
        <ContactsDropdown
            nameFieldName="Fio"
            idFieldName="PersonId"
            value="PersonId4"
            contacts={[
                {
                    PersonId: "PersonId1",
                    Fio: "Соснин Иван",
                    Post: "фронтендер",
                    IsDirector: false
                },
                {
                    PersonId: "PersonId2",
                    Fio: "Запороцеж Оксана",
                    Post: "фронтендер",
                    IsDirector: false
                },
                {
                    PersonId: "PersonId3",
                    Fio: "Чувичкин Дмитрий",
                    Post: "фронтендер",
                    IsDirector: false
                },
                {
                    PersonId: "PersonId4",
                    Fio: "Катаева Анастасия",
                    Post: "фронтендер",
                    IsDirector: true
                }
            ]}
            defaultCaption={text("defaultCaption", "Выберите контакт")}
            width={number("width", 200)}
        />
    ));
