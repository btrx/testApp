import http from "k6/http";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export let options = {
    vus: 1,
    duration: "10s",
    env: {
        url: __ENV.URL || "https://microfrontend-sage.vercel.app/" // set default URL
    }
};

export function handleSummary(data) {
    return {
        "./result/result2.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}

export default function () {
    const res = http.get(options.env.url);
    check(res, {
        "status was 200": (r) => r.status == 200,
        "transaction time OK": (r) => r.timings.duration < 500,
    });
    sleep(1);
}
