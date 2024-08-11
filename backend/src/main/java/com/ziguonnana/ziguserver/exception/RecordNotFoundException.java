package com.ziguonnana.ziguserver.exception;

public class RecordNotFoundException extends RuntimeException {

    public RecordNotFoundException() {
        super("Record not found");
    }

}
