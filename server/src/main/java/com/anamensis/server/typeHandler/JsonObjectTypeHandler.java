package com.anamensis.server.typeHandler;

import com.anamensis.server.dto.SerializedJSONObject;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(SerializedJSONObject.class)
public class JsonObjectTypeHandler implements TypeHandler<SerializedJSONObject> {

    @Override
    public void setParameter(PreparedStatement ps, int i, SerializedJSONObject parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.toString());
    }

    @Override
    public SerializedJSONObject getResult(ResultSet rs, String columnName) throws SQLException {
        return new SerializedJSONObject(rs.getString(columnName));
    }

    @Override
    public SerializedJSONObject getResult(ResultSet rs, int columnIndex) throws SQLException {
        return rs.getObject(columnIndex, SerializedJSONObject.class);
    }

    @Override
    public SerializedJSONObject getResult(CallableStatement cs, int columnIndex) throws SQLException {
        return cs.getObject(columnIndex, SerializedJSONObject.class);
    }

}
