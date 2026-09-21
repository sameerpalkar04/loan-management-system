package com.loan.customerservice.events;

public class CustomerRegisteredEvent {

    private Long customerId;
    private String panNumber;

    public CustomerRegisteredEvent() {
    }

    public CustomerRegisteredEvent(Long customerId, String panNumber) {
        this.customerId = customerId;
        this.panNumber = panNumber;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }
}
