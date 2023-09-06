import EventHandlerInterface from "../../@shared/event/event-handler.interface";
import EventInterface from "../../@shared/event/event.interface";
import CustomerAddressChangedEvent from "./customer-addrress-changed.event";

export default class SendConsoleLogWhenCustomerAddressChangeHandler implements EventHandlerInterface<CustomerAddressChangedEvent> {
    handle(event: EventInterface): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address.street}, ${event.eventData.address.number}, ${event.eventData.address.city}, ${event.eventData.address.zip}`);
    }
}