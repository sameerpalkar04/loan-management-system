package com.loan.customerservice.services.abstractions;

import java.util.Collection;

public interface ServiceManager<TCommand, TQuery, TId> {

    TQuery add(TCommand data);

    TQuery delete(TId id);

    Collection<TQuery> getAll();

    TQuery get(TId id);

    TQuery update(TId id, TCommand data);
}