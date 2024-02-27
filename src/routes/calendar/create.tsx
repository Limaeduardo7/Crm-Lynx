import React, { useState } from "react";
import { useForm } from "@refinedev/antd";
import { HttpError, useNavigation } from "@refinedev/core";
import { Modal } from "antd";
import dayjs from "dayjs";
import { Event, EventCreateInput } from "@/graphql/schema.types";
import { CalendarForm } from "./components";
import { useTranslation } from "react-i18next"; // Importando useTranslation para tradução

type FormValues = EventCreateInput & {
    rangeDate: [dayjs.Dayjs, dayjs.Dayjs];
    date: dayjs.Dayjs;
    time: [dayjs.Dayjs, dayjs.Dayjs];
    color: any;
};

export const CalendarCreatePage: React.FC = () => {
    const { t } = useTranslation(); // Usando useTranslation para tradução
    const [isAllDayEvent, setIsAllDayEvent] = useState(false);
    const { list } = useNavigation();

    const { formProps, saveButtonProps, form, onFinish } = useForm<
        Event,
        HttpError,
        EventCreateInput
    >();

    const handleOnFinish = async (values: FormValues) => {
        const { rangeDate, date, time, color, ...otherValues } = values;

        let startDate = dayjs();
        let endDate = dayjs();

        if (rangeDate) {
            startDate = rangeDate[0].startOf("day");
            endDate = rangeDate[1].endOf("day");
        } else {
            startDate = date
                .set("hour", time[0].hour())
                .set("minute", time[0].minute())
                .set("second", 0);

            endDate = date
                .set("hour", time[1].hour())
                .set("minute", time[1].minute())
                .set("second", 0);
        }

        await onFinish({
            ...otherValues,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            color: typeof color === "object" ? `#${color.toHex()}` : color,
        });
    };

    return (
        <Modal
            title={t("CalendarCreatePage.createEvent")} // Usando tradução para o título
            open
            onCancel={() => {
                list("events");
            }}
            okButtonProps={{
                ...saveButtonProps,
            }}
            okText={t("CalendarCreatePage.save")} // Usando tradução para o texto do botão de salvar
            width={560}
        >
            <CalendarForm
                isAllDayEvent={isAllDayEvent}
                setIsAllDayEvent={setIsAllDayEvent}
                form={form}
                formProps={{
                    ...formProps,
                    onFinish: handleOnFinish,
                }}
            />
        </Modal>
    );
};
