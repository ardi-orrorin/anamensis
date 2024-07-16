package com.anamensis.batch.typeHandler;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;
import org.json.JSONObject;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(JSONObject.class)
public class JsonObjectTypeHandler implements TypeHandler<JSONObject> {

    @Override
    public void setParameter(PreparedStatement ps, int i, JSONObject parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.toString());
    }

    @Override
    public JSONObject getResult(ResultSet rs, String columnName) throws SQLException {
        return new JSONObject(rs.getString(columnName));
    }

    @Override
    public JSONObject getResult(ResultSet rs, int columnIndex) throws SQLException {
        return rs.getObject(columnIndex, JSONObject.class);
    }

    @Override
    public JSONObject getResult(CallableStatement cs, int columnIndex) throws SQLException {
        return cs.getObject(columnIndex, JSONObject.class);
    }

}
