package com.anamensis.server.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Value;

@ToString
public class Page {

    @Getter
    @Setter
    private int page;

    @Getter
    @Setter
    private int size;

    @Getter
    @Setter
    private int total;

    @Setter
    private String criteria;

    @Setter
    private String order;

    @Getter
    @Setter
    private String searchType;

    @Getter
    @Setter
    private String keyword;

    @Getter
    @Setter
    private String filterType;

    @Getter
    @Setter
    private String filterKeyword;


    private boolean endPage;

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
