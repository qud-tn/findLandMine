package com.qudtn.findLandMine.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.qudtn.findLandMine.domain.GameManager;

@Service
public class FindLandMineServiceImpl implements FindLandMineService {

	private GameManager gameManager = new GameManager();

	@Override
	public int[][] makeGame(String mode) {
		int x = 0;
		int y = 0;
		int mine = 0;

		switch (mode) {
		case ("초급"):
			x = 9;
			y = 9;
			mine = 10;
			break;
		case ("중급"):
			x = 16;
			y = 16;
			mine = 40;
			break;
		case ("고급"):
			x = 16;
			y = 30;
			mine = 99;
			break;
		}

		int[][] landMineArray = new int[x][y];

		Random random = new Random();

		for (int i = 0; i < mine; i++) {
			int randomNumberX = random.nextInt(x);

			int randomNumberY = random.nextInt(y);

			if (landMineArray[randomNumberX][randomNumberY] != 1) {
				landMineArray[randomNumberX][randomNumberY] = 1;
			} else {
				i--;
			}
		}

		for (int i = 0; i < landMineArray.length; i++) {
			for (int j = 0; j < landMineArray[0].length; j++) {
				System.out.print(landMineArray[i][j]);
			}
			System.out.println();
		}
		return landMineArray;
	}
	
	@Override
	public int[][] makeGameArray(int[][] landMineArray) {
	    int x= landMineArray.length;
		int y= landMineArray[0].length;
		int[][] gameArray = new int[x][y];

	    for (int i = 0; i < x; i++) {
	        for (int j = 0; j < y; j++) {
	            if (landMineArray[i][j] == 1) {
	                gameArray[i][j] = -1;
	            } else {
	                gameArray[i][j] = countMine(i, j, landMineArray);
	            }
	        }
	    }

	    return gameArray;
	}

	private int countMine(int x, int y, int[][] landMineArray) {
	    int count = 0;
	    for (int i = x - 1; i <= x + 1; i++) {
	        for (int j = y - 1; j <= y + 1; j++) {
	            if (i >= 0 && i < landMineArray.length && j >= 0 && j < landMineArray[0].length) {
	                if (landMineArray[i][j] == 1) {
	                    count++;
	                }
	            }
	        }
	    }
	    return count;
	}


}