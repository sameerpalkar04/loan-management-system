package com.loan.creditscore.events;

public class CustomerRegisteredEvent {

    private Long customerId;
    private String panNumber;

    public CustomerRegisteredEvent() {
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
