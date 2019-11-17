import Layout from "../components/layout";
import fetch from "isomorphic-unfetch";
import { useState, useEffect } from "react";

const data = [
  {
    id: "e5b20ac460047c00c2734fe3d011313dba69193f",
    title:
      "Review and meta-analysis of antidepressant pharmacogenetic findings in major depressive disorder",
    paper_abstract:
      "This systematic review summarizes pharmacogenetic studies on antidepressant response and side effects. Out of the 17 genes we reviewed, 8 genes were entered into the meta-analysis (SLC6A4, HTR1A, HTR2A, TPH1, gene encoding the β-3 subunit, brain-derived neurotrophic factor (BDNF), HTR3A and HTR3B). TPH1 218C/C genotype (7 studies, 754 subjects) was significantly associated with a better response (odds ratio, OR=1.62; P=0.005) with no heterogeneity between ethnicities. A better response was also observed in subjects with the Met variant within the BDNF 66Val/Met polymorphism (4 studies, 490 subjects; OR=1.63, P=0.02). Variable number of tandem repeats polymorphism within intron 2 (STin2) 12/12 genotype showed a trend toward a better response in Asians (STin2: 5 studies, 686 subjects; OR=3.89, P=0.03). As for side effects, pooled ORs of serotonin transporter gene promoter polymorphism (5-HTTLPR) l (9 studies, 2642 subjects) and HTR2A −1438G/G (7 studies, 801 subjects) were associated with a significant risk modulation (OR=0.64, P=0.0005) and (OR=1.91, P=0.0006), respectively. Interestingly, this significance became more robust when analyzed with side effect induced by selective serotonin reuptake inhibitors only (5-HTTLPR: P=0.0001, HTR2A: P<0.0001). No significant result could be observed for the other variants. These results were not corrected for multiple testing in each variant, phenotype and subcategory. This would have required a Bonferroni significance level of P<0.0023. Although some heterogeneity was present across studies, our finding suggests that 5-HTTLPR, STin2, HTR1A, HTR2A, TPH1 and BDNF may modulate antidepressant response."
  },
  {
    id: "50bc25597b4380d8f85795f087214c1e588a67ee",
    title:
      "No association of genetic variants in BDNF with major depression: a meta- and gene-based analysis.",
    paper_abstract:
      "Major depressive disorder (MDD) is a complex psychiatric condition with strong genetic predisposition. The association of MDD with genetic polymorphisms, such as Val66Met (rs6265), in the brain derived neurotrophic factor (BDNF), have been reported in many studies and the results were conflicting. In this study, we performed a systematic literature search and conducted random-effects meta-analysis to evaluate genetic variants in BDNF with MDD. A gene-based analysis was also conducted to investigate the cumulative effects of genetic polymorphisms in BDNF. A total of 28 studies from 26 published articles were included in our analysis. Meta-analysis yielded an estimated odds ratio (OR) of 0.96 (95% CI: 0.89-1.05; P = 0.402) for Val66Met (rs6265), 0.83 (95% CI: 0.67-1.04; P = 0.103) for 11757C/G, 1.16 (95% CI: 0.74-1.82; P = 0.527) for 270T/C, 1.03 (95% CI: 0.18-5.75; P = 0.974) for 712A/G and 0.98 (95% CI: 0.85-1.14; P = 0.831) for rs988748. The gene-based analysis indicated that BDNF is not associated with MDD (P > 0.21). Our updated meta- and novel gene-based analyses provide no evidence of the association of BDNF with major depression."
  },
  {
    id: "11c34b0812efb8d8207cc9bd37f150798eae2664",
    title: "Effects of BDNF Polymorphisms on Antidepressant Action",
    paper_abstract:
      "Evidence suggests that the down-regulation of the signaling pathway involving brain-derived neurotrophic factor (BDNF), a molecular element known to regulate neuronal plasticity and survival, plays an important role in the pathogenesis of major depression. The restoration of BDNF activity induced by antidepressant treatment has been implicated in the antidepressant therapeutic mechanism. Because there is variability among patients with major depressive disorder in terms of response to antidepressant treatment and since genetic factors may contribute to this inter-individual variability in antidepressant response, pharmacogenetic studies have tested the associations between genetic polymorphisms in candidate genes related to antidepressant therapeutic action. In human BDNF gene, there is a common functional polymorphism (Val66Met) in the pro-region of BDNF, which affects the intracellular trafficking of proBDNF. Because of the potentially important role of BDNF in the antidepressant mechanism, many pharmacogenetic studies have tested the association between this polymorphism and the antidepressant therapeutic response, but they have produced inconsistent results. A recent meta-analysis of eight studies, which included data from 1,115 subjects, suggested that the Val/Met carriers have increased antidepressant response in comparison to Val/Val homozygotes, particularly in the Asian population. The positive molecular heterosis effect (subjects heterozygous for a specific genetic polymorphism show a significantly greater effect) is compatible with animal studies showing that, although BDNF exerts an antidepressant effect, too much BDNF may have a detrimental effect on mood. Several recommendations are proposed for future antidepressant pharmacogenetic studies of BDNF, including the consideration of multiple polymorphisms and a haplotype approach, gene-gene interaction, a single antidepressant regimen, controlling for age and gender interactions, and pharmacogenetic effects on specific depressive symptom-clusters."
  }
];
const SvgButton = () => (
  <button
    className="bg-blue-500 hover:bg-blue-700 text-white 
  font-bold py-2 px-4 rounded-full outline-none border-transparent focus:outline-none"
  >
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 fill-current"
    >
      <path
        d="M12.906 14.32a8 8 0 111.414-1.414l5.337 5.337-1.414 1.414-5.337-5.337zM8 14A6 6 0 108 2a6 6 0 000 12z"
        fillRule="evenodd"
      />
    </svg>
  </button>
);
function PaperTable() {
  return (
    <div
      className="bg-white shadow-md rounded my-6 mx-auto"
      style={{ width: "95%" }}
    >
      <table className="text-left table-fixed">
        <thead>
          <tr>
            <th
              className="py-4 px-6 bg-grey-lightest font-bold uppercase text-grey-dark border-b border-grey-light
             w-1/4
            "
            >
              Title
            </th>
            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-grey-dark border-b border-grey-light">
              Abstract
            </th>
            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-grey-dark border-b border-grey-light">
              Find Meta!
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-4 px-4 text-justify">{data[0].title}</td>
            <td className="py-4 px-4 text-justify">{data[0].paper_abstract}</td>
            <td className="py-4 px-4 text-justify">
              <SvgButton></SvgButton>
            </td>
          </tr>
          <tr>
            <td className="py-4 px-4 text-justify ">{data[1].title}</td>
            <td className="py-4 px-4 text-justify">{data[1].paper_abstract}</td>

            <td className="py-4 px-4 text-justify">
              <SvgButton></SvgButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
const dev = process.env.NODE_ENV !== "production";
const addr = dev ? "http://localhost:3000" : "https://ricon.dev";
function Home() {
  const [toShow, setToShow] = useState("");
  const [paperId, setPaperId] = useState(
    "8e6cc384e424b89b69482d3454afe74ab2ee42b8"
  );

  useEffect(() => {
    async function fetchData() {
      // Update the document title using the browser API
      const stuff = await fetch(`${addr}/api/get_paper?id=${paperId}`).then(a =>
        a.json()
      );
      setToShow(stuff);
      console.log(process.env);
      console.log(stuff);
    }
    fetchData();
  }, [paperId]);
  return (
    // <Layout>
    <div className="flex flex-col bg-gray-300  h-screen ">
      <div className="mx-auto">
        <h1 className="font-bold  text-4xl md:text-6xl text-center text-gray-800 ">
          Meta-Search
        </h1>
        <p className="text-center text-2xl">
          Find{" "}
          <span className="text-teal-500 font-bold">
            Systematic reviews and meta-analysis{" "}
          </span>
          that cite a given paper!
        </p>
      </div>

      <input
        className="py-3 px-4 bg-white mt-8 rounded-full shadow-md
      outline-none focus:shadow-xl border-transparent mx-auto"
        style={{ minWidth: "50%", maxWidth: "1000px" }}
        placeholder="Search by title or id"
      ></input>
      <PaperTable />
    </div>

    // </Layout>
  );
}

export default Home;
