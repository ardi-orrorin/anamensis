package com.anamensis.server.typeHandler;

import com.anamensis.server.entity.RoleType;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(RoleType.class)
public class RoleTypeHandler implements TypeHandler<RoleType> {
    @Override
    public void setParameter(PreparedStatement ps, int i, RoleType parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name());
    }

    @Override
    public RoleType getResult(ResultSet rs, String columnName) throws SQLException {
        return RoleType.valueOf(rs.getString(columnName));
    }

    @Override
    public RoleType getResult(ResultSet rs, int columnIndex) throws SQLException {
        return RoleType.valueOf(rs.getString(columnIndex));
    }

    @Override
    public RoleType getResult(CallableStatement cs, int columnIndex) throws SQLException {
        return RoleType.valueOf(cs.getString(columnIndex));
    }
}
