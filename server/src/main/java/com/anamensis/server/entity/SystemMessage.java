package com.anamensis.server.entity;


import com.anamensis.server.dto.seriallizer.StringNullSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class SystemMessage {

    private int id;

    private String webSysPk;

    private String subject;

    private String content;

    @JsonIgnore
    private LocalDateTime createAt;

    @JsonIgnore
    private LocalDateTime updateAt;

    private boolean isUse;

    @JsonSerialize(nullsUsing = StringNullSerializer.class)
    private String extra1;

    @JsonSerialize(nullsUsing = StringNullSerializer.class)
    private String extra2;

    @JsonSerialize(nullsUsing = StringNullSerializer.class)
    private String extra3;

    @JsonSerialize(nullsUsing = StringNullSerializer.class)
    private String extra4;

    @JsonSerialize(nullsUsing = StringNullSerializer.class)
    private String extra5;

}
