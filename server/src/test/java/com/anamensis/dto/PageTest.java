package com.anamensis.dto;

import com.anamensis.server.dto.Page;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;

public class PageTest {

    Logger log = org.slf4j.LoggerFactory.getLogger(PageTest.class);

    @Test
    public void testGetPage() {
        int page = 2;
        int limit = 15;

        int offset = (Math.max(page, 1) - 1) * limit;
    }
}
