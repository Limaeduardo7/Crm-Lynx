import React from "react";
import { useNavigation, useTranslate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Badge } from "antd";
import dayjs from "dayjs";
import { UpcomingEventsQuery } from "@/graphql/types";
import { Text } from "../../../text";
import styles from "../index.module.css";

import { useTranslation } from "react-i18next";

type CalendarUpcomingEventProps = {
  item: GetFieldsFromList<UpcomingEventsQuery>;
};

export const CalendarUpcomingEvent: React.FC<CalendarUpcomingEventProps> = ({
  item,
}) => {
  const { show } = useNavigation();
  const { id, title, startDate, endDate, color } = item;
  const { t } = useTranslation();

  const isToday = dayjs.utc(startDate).isSame(dayjs.utc(), "day");
  const isTomorrow = dayjs
    .utc(startDate)
    .isSame(dayjs.utc().add(1, "day"), "day");

  const isAllDayEvent =
    dayjs.utc(startDate).startOf("day").isSame(startDate) &&
    dayjs.utc(endDate).endOf("day").isSame(endDate);

  const renderDate = () => {
    if (isToday) {
      return t("calendarUpcomingEvents.today");
    }

    if (isTomorrow) {
      return t("calendarUpcomingEvents.tomorrow");
    }

    return dayjs(startDate).format("MMM DD");
  };

  const renderTime = () => {
    if (isAllDayEvent) {
      return t("calendarUpcomingEvents.allDay");
    }

    return `${dayjs(startDate).format("HH:mm")} - ${dayjs(endDate).format(
      "HH:mm"
    )}`;
  };

  return (
    <div
      onClick={() => {
        show("events", item.id);
      }}
      key={id}
      className={styles.item}
    >
      <div className={styles.date}>
        <Badge color={color} className={styles.badge} />
        <Text size="xs">{`${renderDate()}, ${renderTime()}`}</Text>
      </div>
      <Text ellipsis={{ tooltip: true }} strong className={styles.title}>
        {title}
      </Text>
    </div>
  );
};
