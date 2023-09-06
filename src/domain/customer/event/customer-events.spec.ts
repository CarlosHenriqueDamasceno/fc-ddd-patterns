import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerCreatedEvent from "./customer-created.event";
import SendConsoleLogWhenCustomerAddressChangeHandler from "./send-console-log-when-customer-address-change.handler";
import SendConsoleLog1WhenCustomerCreatedHandler from "./send-console-log1-when-customer-created.handler";
import SendConsoleLog2WhenCustomerCreatedHandler from "./send-console-log2-when-customer-created.handler";

describe("Customer aggregate events tests", () => {
    it("Should call console log 1 and 2 handlers when customer created", () => {
        const eventDispatcher = new EventDispatcher();
        const consoleLog1EventHandler = new SendConsoleLog1WhenCustomerCreatedHandler();
        const consoleLog2EventHandler = new SendConsoleLog2WhenCustomerCreatedHandler();
        const spyConsoleLog1EventHandler = jest.spyOn(consoleLog1EventHandler, "handle");
        const spyConsoleLog2EventHandler = jest.spyOn(consoleLog2EventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", consoleLog1EventHandler);
        eventDispatcher.register("CustomerCreatedEvent", consoleLog2EventHandler);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
            2
        );
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(consoleLog1EventHandler);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(consoleLog2EventHandler);

        const productCreatedEvent = new CustomerCreatedEvent({});

        eventDispatcher.notify(productCreatedEvent);

        expect(spyConsoleLog1EventHandler).toHaveBeenCalled();
        expect(spyConsoleLog2EventHandler).toHaveBeenCalled();
    })

    it("Should call console log when customer address is changed", () => {
        const eventDispatcher = new EventDispatcher();
        const consoleLogHandler = new SendConsoleLogWhenCustomerAddressChangeHandler();
        const spyConsoleLogEventHandler = jest.spyOn(consoleLogHandler, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", consoleLogHandler);

        expect(
            eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(
            1
        );
        expect(
            eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
        ).toMatchObject(consoleLogHandler);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");

        customer.changeAddress(address, eventDispatcher);

        expect(spyConsoleLogEventHandler).toHaveBeenCalled();
    })
})