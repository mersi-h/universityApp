package com.fti.university.models;

import java.io.Serializable;
import java.util.Objects;

public class Coordinates implements Serializable {

    private double latitude = 0;
    private double longitude = 0;

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public Coordinates(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    @Override
    public boolean equals(Object obj) {
        return super.equals(obj);
    }

    @Override
    public String toString() {
        return "Coordinates{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
    @Override
    public int hashCode() {
        return Objects.hash(getLatitude(), getLongitude());
    }
}
