"use client"

import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";
import {GetClassByID} from "@/sections/class/data";
import {GetSessionByID, PutChangeSessionStatusByID, PutStudentInSessionByID} from "@/sections/session/data";
import {Avatar, Button, Container, ListItemAvatar, Stack, Typography} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as faceApi from 'face-api.js';
import {useSearchParams} from "next/navigation";
import {enqueueSnackbar} from "notistack";
import React, {useEffect, useRef, useState} from 'react';

interface StudentAvatarParams {
	id: number,
	name: string,
	avatar: string,
	avatars: string[]
}

function AttendanceView() {
	const searchParams = useSearchParams()
	const session_id = searchParams.get("session_id");
	const class_id = searchParams.get("class_id");
	const [completeStudents, setCompleteStudents] = useState<number[]>([])
	const [studentFaceList, setStudentFaceList] = useState<StudentAvatarParams[]>([])

	const [drawerState, setDrawerState] = React.useState({
		classStudent: false,
		completeStudent: false,
	});

	const cameraVideoRef = useRef<HTMLVideoElement>(null);
	const canvasDivRef = useRef<HTMLCanvasElement>(null);

	// const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState<faceApi.LabeledFaceDescriptors[]>([]);

	const {
		memoizedValue: {data: ClassData, isLoading: isLoadingClass},
		mutate: mutateClass
	} = GetClassByID(Number(class_id))
	const {
		memoizedValue: {data: SessionData, isLoading: isLoadingSession},
		mutate: mutateSession
	} = GetSessionByID(Number(session_id))

	useEffect(() => {
		console.log("ClassData", ClassData)
		setStudentFaceList(() => [])
		ClassData?.attributes.students?.data.map((item) => {
			if (!studentFaceList.some(i => i.id === item.id)) {
				setStudentFaceList(prevState => [
					...prevState,
					{
						id: item.id,
						name: item.attributes.name,
						avatar: item.attributes.avatar.data.attributes.url,
						avatars: item.attributes.avatars.data.map(i => i.attributes.url)
					}
				])
			}
		})


		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ClassData])

	useEffect(() => {
		console.log("studentFaceList", studentFaceList)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [studentFaceList])

	useEffect(() => {
		console.log("SessionData", SessionData)
		SessionData?.attributes.complete_students?.data.map((item) => {
			if (!completeStudents.includes(item.id)) {
				setCompleteStudents(prevState => [
					...prevState,
					item.id
				])
			}
		})


		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [SessionData])

	useEffect(() => {
		if (SessionData?.attributes.complete_students?.data.length === ClassData?.attributes.students?.data.length &&
			SessionData?.attributes.complete_students?.data.length !== undefined &&
			ClassData?.attributes.students?.data.length !== undefined
		) {
			PutChangeSessionStatusByID(Number(session_id), true).then(res => {
				if (res) {
					enqueueSnackbar("本次签到已完成", {
						variant: "success",
						autoHideDuration: 5000,
						anchorOrigin: {vertical: 'top', horizontal: 'right'}
					})
				}
			})
		} else if (SessionData?.attributes.completed) {
			enqueueSnackbar("本次签到已完成", {variant: "success", anchorOrigin: {vertical: 'bottom', horizontal: 'right'}})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [SessionData, session_id])

	useEffect(() => {
		console.log("completeStudents", completeStudents)
	}, [completeStudents])


	// 启动摄像头
	function openMedia() {
		const opt = {
			audio: false,
			video: true
		};

		navigator.mediaDevices.getUserMedia(opt)
		.then((mediaStream) => {
			const video = cameraVideoRef.current;
			// 旧的浏览器可能没有srcObject
			if (video) {
				if ('srcObject' in video) {
					video.srcObject = mediaStream;
					video.play().then()
				} else {
					enqueueSnackbar("您的浏览器不支持摄像头访问", {
						variant: "error",
						anchorOrigin: {vertical: 'bottom', horizontal: 'right'}
					})
				}
			}
		})
		.catch((err) => {
			enqueueSnackbar(`未识别到有用设备`, {
				variant: "warning",
				anchorOrigin: {vertical: 'bottom', horizontal: 'right'},
				preventDuplicate: true,
			})

			console.log("error", err)


			// const video = cameraVideoRef.current;
			// if (video) {
			// 	video.src = "https://easychuan.cn/r/e95ck?t=v";
			// 	video.play().then();
			// 	video.width = 304
			// 	video.height = 504
			// }

		});
	}

	useEffect(() => {
		// 模型加载
		Promise.all([
			// 轻量人脸识别模型
			faceApi.nets.tinyFaceDetector.loadFromUri("/models"),
			// google人脸识别模型
			// faceApi.nets.ssdMobilenetv1.loadFromUri("/models"),
			// 识别五官
			faceApi.nets.faceLandmark68Net.loadFromUri("/models"),
			// 识别范围内人脸
			faceApi.nets.faceRecognitionNet.loadFromUri("/models"),
			// 识别情绪
			faceApi.nets.faceExpressionNet.loadFromUri("/models"),
		]).then(openMedia)
	}, [])

	async function loadLabeledImages() {
		if (studentFaceList.length > 0) {
			return Promise.all(studentFaceList.map(async (item) => {
				const descriptions: Float32Array[] = []


				for (let i = 0; i < item.avatars.length; i++) {
					const s = item.avatars[ i ];
					// item.avatars.map(async (avatar) => {
					const img = await faceApi.fetchImage(`${s}`)

					//识别人脸的初始化参数
					// const options = new faceApi.SsdMobilenetv1Options({minConfidence: 0.38})
					const options = new faceApi.TinyFaceDetectorOptions()

					//扫描图片中人脸的轮廓数据
					const detections = await faceApi.detectSingleFace(img, options).withFaceLandmarks().withFaceDescriptor()

					if (detections) {
						descriptions.push(detections.descriptor)
					} else {
						console.warn('Unrecognizable face')
					}
					// })
				}
				return new faceApi.LabeledFaceDescriptors(item.id.toString(), descriptions)
			}))


		} else return

	}


	async function onPlay(): Promise<any> {
		if (!cameraVideoRef.current) return;
		const video = cameraVideoRef.current;

		if (video.paused || video.ended) {
			return setTimeout(() => onPlay());
		}


		const canvas = faceApi.createCanvasFromMedia(video);

		if (canvasDivRef.current) {
			canvasDivRef.current.append(canvas);
		}

		//加载维护好的人脸数据(人脸的特征数据和标签，用于后面的比对)
		const labeledFaceDescriptors = await loadLabeledImages()


		const result = await faceApi.detectSingleFace(
			video,
			new faceApi.TinyFaceDetectorOptions(),
			// new faceApi.SsdMobilenetv1Options({minConfidence: 0.38})
		)
		.withFaceLandmarks()
		.withFaceDescriptor()

		const displaySize = {
			width: video.width,
			height: video.height,
		}

		// 绘制人脸
		if (result) {
			const canvas = canvasDivRef.current
			if (canvas) {
				faceApi.matchDimensions(canvas, displaySize, true);
				const resizedDetection = faceApi.resizeResults(result, displaySize);

				// console.log("labeledFaceDescriptors", labeledFaceDescriptors)
				if (labeledFaceDescriptors!.length > 0) {
					//比对人脸特征数据
					const faceMatcher = new faceApi.FaceMatcher(labeledFaceDescriptors,)
					const label = faceMatcher.findBestMatch(resizedDetection.descriptor)

					//显示比对的结果
					const box = resizedDetection.detection.box
					const drawBox = new faceApi.draw.DrawBox(
						box,
						{label: `${studentFaceList.find(i => i.id.toString() === label.label)?.name}(${( ( 1 - label.distance ) * 100 ).toFixed(0)}%)`})
					drawBox.draw(canvas)


					//设置最大停留时间为2秒
					setTimeout(() => {
						canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);

					}, 2000);

					if (studentFaceList.some(i => i.id.toString() === label.label)) {


						// 学生签到
						const student = studentFaceList.find(i => i.id.toString() === label.label)
						if (student && !completeStudents.includes(student.id)) {


							if (( 1 - label.distance ) > 0.5) {
								enqueueSnackbar('人脸识别率偏低，请重新签到', {variant: "warning"})
							} else {
								completeStudents.push(student.id)

								PutStudentInSessionByID(Number(session_id), student.id, completeStudents).then(res => {
									if (res) {
										mutateSession()
										mutateClass()
										enqueueSnackbar(`学生 ${student.name} 签到成功`, {
											variant: "success",
											anchorOrigin: {vertical: 'bottom', horizontal: 'right'}
										})
									}
								})

							}

						}


					}

				}


			}

		}

		setTimeout(() => onPlay());
	}


	const toggleDrawer = (anchor: string, open: boolean) =>
		(event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === 'keydown' &&
				( ( event as React.KeyboardEvent ).key === 'Tab' ||
					( event as React.KeyboardEvent ).key === 'Shift' )
			) {
				return;
			}

			setDrawerState({...drawerState, [ anchor ]: open});
		};


	if (isLoadingClass || isLoadingSession) {
		return <LoadingScreen/>
	}

	return (
		<Container maxWidth={"xl"}>

			<Stack sx={{width: "100%", minWidth: "80vw"}} direction={"row"}>
				<Stack
					sx={{width: "75%", p: 0, minHeight: "72vh"}}
					direction={"row"}
					alignItems={"center"}
					justifyContent={"center"}
					justifyItems={"center"}
				>
					{/*	添加一个视频框，可以调取设备摄像头，如果没有，则调用public目录下的/video/face.mp4文件*/}
					<video
						autoPlay
						loop
						muted
						// controls
						width="720"
						height="560"
						id={"cameraVideo"}
						onLoadedData={onPlay}
						ref={cameraVideoRef}
					/>

					<canvas
						ref={canvasDivRef}
						id={"canvas"}
						style={{
							position: "absolute",
						}}
					/>
				</Stack>

				<Stack sx={{width: "25%", p: 2,}}>

					{/*	创建一个带学生头像的学生列表 */}
					<List
						subheader={<Typography sx={{whiteSpace: "nowrap", ml: 2, my: 1, fontSize: 22}}>学生列表</Typography>}
						sx={{
							width: '100%',
							height: "70vh",
							background: "linear-gradient(102deg, #F1F5FE 8.4%, #FEF8F1 83.36%)",
							borderRadius: "10px",
							minWidth: "166px"
						}}
					>

						<Stack direction={"row"} justifyContent={"center"}>
							<Button
								variant="contained"
								fullWidth
								sx={{mx: 2, mb: 0.5}}
								onClick={toggleDrawer("completeStudent", true)}
							>{"查看已签到学生"}</Button>
						</Stack>
						<List sx={{width: '100%', maxHeight: "70vh", overflowY: "auto", borderRadius: "20px"}}>
							{ClassData?.attributes.students?.data.length === 0 &&
                  <ListItemText sx={{whiteSpace: "nowrap"}}>暂无学生</ListItemText>}


							{ClassData?.attributes.students?.data.map(student => (
								<ListItemButton key={student.id}>
									<ListItemAvatar>
										<Avatar
											sx={{mr: 1, width: 48, height: 48}}
											variant="rounded"
											src={`${student.attributes.avatar?.data.attributes.url}`}
											alt={student.attributes.name}
										/>
									</ListItemAvatar>

									<ListItemText
										primary={<Typography sx={{fontSize: 18}}>{student.attributes.name}</Typography>}
										secondary={completeStudents.includes(student.id) ?
											<Typography sx={{color: "green", fontSize: 15}}>已签到</Typography> :
											<Typography sx={{color: "red", fontSize: 15}}>未签到</Typography>
										}
										sx={{whiteSpace: "nowrap"}}
									/>
								</ListItemButton>
							))}


						</List>
					</List>
				</Stack>

			</Stack>


			<Drawer
				anchor={"right"}
				open={drawerState.completeStudent}
				onClose={toggleDrawer("completeStudent", false)}
			>
				<Stack
					sx={{width: 250, pt: 4, px: 2}}
					onClick={toggleDrawer("completeStudent", false)}
					onKeyDown={toggleDrawer("completeStudent", false)}
				>
					<List
						subheader={<Typography sx={{whiteSpace: "nowrap", ml: 2, fontSize: 22}}>已签到学生列表</Typography>}
						sx={{width: '100%', bgcolor: 'background.paper'}}
					>

						{SessionData?.attributes.complete_students?.data.length === 0 &&
                <ListItemText sx={{whiteSpace: "nowrap", textAlign: "center"}}>无签到学生</ListItemText>}

						{SessionData?.attributes.complete_students?.data.map(student => (
							<ListItemButton key={student.id}>
								<ListItemAvatar>
									<Avatar
										sx={{mr: 1, width: 48, height: 48}}
										variant="rounded"
										src={`${process.env.NEXT_PUBLIC_API_URL}${student.attributes.avatar?.data.attributes.url}`}
										alt={student.attributes.name}
									/>
								</ListItemAvatar>
								<ListItemText
									primary={<Typography sx={{fontSize: 18}}>{student.attributes.name}</Typography>}
									secondary={student.attributes.uid}
									sx={{whiteSpace: "nowrap"}}
								/>

							</ListItemButton>
						))}
					</List>
				</Stack>

			</Drawer>

		</Container>
	);
}

export default AttendanceView;