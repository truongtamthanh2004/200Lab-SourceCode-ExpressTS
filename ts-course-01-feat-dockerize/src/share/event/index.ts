import { AppEvent } from "@share/model/event";

export type MyCreatedEventPayload = {
  name: string;
};

export const EvtMyCreatedEvent = 'EvtMyCreatedEvent';

export class MyCreatedEvent extends AppEvent<MyCreatedEventPayload> {
  static create(payload: MyCreatedEventPayload, senderId: string) {
    return new MyCreatedEvent(EvtMyCreatedEvent, payload, { senderId });
  }

  static from(json: any) {
    const { eventName, payload, id, occurredAt, senderId } = json;
    return new MyCreatedEvent(eventName, payload, { id, occurredAt, senderId });
  }
};