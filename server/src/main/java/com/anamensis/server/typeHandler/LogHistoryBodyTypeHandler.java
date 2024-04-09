package com.anamensis.server.typeHandler;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LogHistoryBodyTypeHandler implements TypeHandler<JSONObject> {
    @Override
    public void setParameter(PreparedStatement ps, int i, JSONObject parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.toString());
    }

    @Override
    public JSONObject getResult(ResultSet rs, String columnName) throws SQLException {
        try {
            return rs.getString(columnName) == null ? null : new JSONObject(rs.getString(columnName));
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public JSONObject getResult(ResultSet rs, int columnIndex) throws SQLException {
        try {
            return rs.getString(columnIndex) == null ? null : new JSONObject(rs.getString(columnIndex));
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public JSONObject getResult(CallableStatement cs, int columnIndex) throws SQLException {
        try {
            return cs.getString(columnIndex) == null ? null : new JSONObject(cs.getString(columnIndex));
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
    }
}
