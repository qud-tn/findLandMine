package com.qudtn.findLandMine.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qudtn.findLandMine.service.FindLandMineService;

@RestController
@RequestMapping(value = "/game")
@CrossOrigin(origins = "http://localhost:3000")
public class FindLandMineRestController {
	@Autowired
	private FindLandMineService fmService;

	@PostMapping(value = "/start")
	public ResponseEntity<String> startGame(@RequestBody String mode) {
		System.out.println(mode);

		mode = mode.substring(9, 11);

		System.out.println(mode);

		int[][] gameArray = fmService.makeGame(mode);
		Object[][] finalGameArray = fmService.makeGameArray(gameArray);

		if (gameArray.length != 0) {
			ObjectMapper objectmapper = new ObjectMapper();

			String landMineArray;

			try {
				landMineArray = objectmapper.writeValueAsString(finalGameArray);

				return ResponseEntity.ok(landMineArray);
			} catch (JsonProcessingException e) {
				return ResponseEntity.badRequest().body("게임 난이도 설정 오류");
			}
		} else {
			return ResponseEntity.badRequest().body("게임 난이도 설정 오류");
		}
	}
}
