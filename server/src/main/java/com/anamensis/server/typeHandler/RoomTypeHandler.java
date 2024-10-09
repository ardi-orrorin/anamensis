package com.anamensis.server.typeHandler;

import com.anamensis.server.dto.RoomType;
import com.anamensis.server.entity.AuthType;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(RoomType.class)
public class RoomTypeHandler implements TypeHandler<RoomType> {

    @Override
    public void setParameter(PreparedStatement ps, int i, RoomType parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name());
    }

    @Override
    public RoomType getResult(ResultSet rs, String columnName) throws SQLException {
        return RoomType.valueOf(rs.getString(columnName));
    }

    @Override
    public RoomType getResult(ResultSet rs, int columnIndex) throws SQLException {
        return RoomType.valueOf(rs.getString(columnIndex));
    }

    @Override
    public RoomType getResult(CallableStatement cs, int columnIndex) throws SQLException {
        return RoomType.valueOf(cs.getString(columnIndex));
    }
}
