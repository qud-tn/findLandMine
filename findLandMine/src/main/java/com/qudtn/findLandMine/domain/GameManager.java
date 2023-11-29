package com.qudtn.findLandMine.domain;

public class GameManager {
	private int[][] landMineArray;
	private String mode;
	
	public void initializeLandMineArray(int x, int y) {
        this.landMineArray = new int[x][y];
    }
	
	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public int[][] getLandMineArray() {
		return landMineArray;
	}

	public void setLandMineArray(int[][] landMineArray) {
		this.landMineArray = landMineArray;
	}
	
	
}
