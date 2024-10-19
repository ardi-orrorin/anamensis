package com.anamensis.server.dto;

import org.json.JSONObject;

import java.io.Serial;
import java.io.Serializable;
import java.util.Map;

public class SerializedJSONObject extends JSONObject implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private final Map<String, Object> map;

    public SerializedJSONObject(Map<String, Object> content) {
        super(content);
        this.map = super.toMap();
    }

    public SerializedJSONObject(JSONObject content) {
        super(content);
        this.map = super.toMap();
    }

    public SerializedJSONObject(String string) {
        super(string);
        this.map = super.toMap();
    }

    @Override
    public String toString() {
        return super.toString();
    }

    @Override
    public Map<String, Object> toMap() {
        return this.map;
    }
}
