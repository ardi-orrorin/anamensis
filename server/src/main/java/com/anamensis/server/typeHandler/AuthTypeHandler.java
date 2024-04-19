package com.anamensis.server.typeHandler;

import com.anamensis.server.entity.AuthType;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(AuthType.class)
public class AuthTypeHandler implements TypeHandler<AuthType> {

    @Override
    public void setParameter(PreparedStatement ps, int i, AuthType parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name());
    }

    @Override
    public AuthType getResult(ResultSet rs, String columnName) throws SQLException {
        return AuthType.valueOf(rs.getString(columnName));
    }

    @Override
    public AuthType getResult(ResultSet rs, int columnIndex) throws SQLException {
        return AuthType.valueOf(rs.getString(columnIndex));
    }

    @Override
    public AuthType getResult(CallableStatement cs, int columnIndex) throws SQLException {
        return AuthType.valueOf(cs.getString(columnIndex));
    }
}
