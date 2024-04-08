package com.anamensis.server.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;

public class Page {

    private final int DEFAULT_PAGE = 1;

    private final int DEFAULT_SIZE = 15;

    @Setter
    private int page;

    @Setter
    private int size;

    @Getter
    @Setter
    private int total;

    @Setter
    private String criteria;

    @Setter
    private String order;

    private boolean endPage;

    public int getPage() {
        return page == 0 ? DEFAULT_PAGE : page;
    }

    public int getSize() {
        return size == 0 ? DEFAULT_SIZE : size;
    }

    public int getOffset() {
        int max = page <= 1 ? 1 : page;
        return (max - 1) * size;
    }

    public String getCriteria() {
        return this.criteria == null ? "id" : this.criteria;
    }

    public String getSort() {
        return this.order == null ? "asc" : this.order;
    }

    public boolean isEndPage() {
        return total <= page * size;
    }

}
