package com.anamensis.server.dto;

import lombok.Getter;
import lombok.Setter;

public class Page {
    @Getter
    @Setter
    private int page;

    @Getter
    @Setter
    private int limit;

    @Getter
    @Setter
    private int total;

    @Setter
    private String criteria;

    @Setter
    private String order;

    private boolean endPage;

    public int getOffset() {
        int max = page <= 1 ? 1 : page;
        return (max - 1) * limit;
    }

    public String getCriteria() {
        return this.criteria == null ? "id" : this.criteria;
    }

    public String getSort() {
        return this.order == null ? "asc" : this.order;
    }

    public boolean isEndPage() {
        return total <= page * limit;
    }

}
