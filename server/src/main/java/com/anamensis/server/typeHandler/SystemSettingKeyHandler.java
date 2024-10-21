package com.anamensis.server.typeHandler;

import com.anamensis.server.entity.SystemSettingKey;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(SystemSettingKey.class)
public class SystemSettingKeyHandler implements TypeHandler<SystemSettingKey> {

    @Override
    public void setParameter(PreparedStatement ps, int i, SystemSettingKey parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name());
    }

    @Override
    public SystemSettingKey getResult(ResultSet rs, String columnName) throws SQLException {
        return SystemSettingKey.valueOf(rs.getString(columnName));
    }

    @Override
    public SystemSettingKey getResult(ResultSet rs, int columnIndex) throws SQLException {
        return SystemSettingKey.valueOf(rs.getString(columnIndex));
    }

    @Override
    public SystemSettingKey getResult(CallableStatement cs, int columnIndex) throws SQLException {
        return SystemSettingKey.valueOf(cs.getString(columnIndex));
    }
}
