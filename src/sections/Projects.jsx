import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { projectsData, projectSubtitle } from "../constants";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Projects = () => {
	const text = `Some Yap`;
	const serviceRefs = useRef([]);
	const isDesktop = useMediaQuery({ minWidth: "48rem" }); //768px

	// useGSAP(() => {
	// 	serviceRefs.current.forEach((el) => {
	// 		if (!el) return;

	// 		gsap.from(el, {
	// 			y: 200,
	// 			scrollTrigger: {
	// 				trigger: el,
	// 				start: "top 80%",
	// 			},
	// 			duration: 1,
	// 			ease: "circ.out",
	// 		});
	// 	});
	// }, []);

	return (

		<section id="projects" className="bg-[#e5e5e0] rounded-t-4xl">

			<AnimatedHeaderSection
				subTitle={projectSubtitle.tagline}
				title={"Projects"}
				text={projectSubtitle.subtitle}
				textColor={"text-black"}
				withScrollTrigger={true}
			/>

			{projectsData.map((project, index) => (
				<div
				ref={(el) => (serviceRefs.current[index] = el)}
				key={index}
				className="px-10 pt-6 pb-12 text-black bg-[#e5e5e0] border-t-2 border-black/20"
				>
					<div className="flex items-center justify-between gap-4 font-light">

						<div className="flex flex-col gap-6">

							<h2 className="text-4xl lg:text-5xl">{project.title}</h2>

							<p className="text-xl leading-relaxed tracking-widest lg:text-2xl text-black/60 text-pretty">
								{project.description}
							</p>

							{/* Tech stack */}
							<div className="flex flex-wrap items-center gap-3">
								{project.tech.map((tech, techIndex) => (
									<span
										key={techIndex}
										className="px-3 py-1 text-sm tracking-wide border border-black/30 rounded-full"
									>
										{tech}
									</span>
								))}
							</div>


						</div>

					</div>

					<div className="flex flex-wrap items-center gap-6 mt-4 text-sm min-h-[1.5rem]">
						{project.links &&
							Object.entries(project.links)
							.map(([name, url]) => (
								<a
								key={name}
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								className="underline underline-offset-4 opacity-70 hover:opacity-100"
								>
								{name}
								</a>
							))}
					</div>



				</div>
			))}
		</section>
	);
};

export default Projects;
