"use client"

import { FormEvent, useEffect, useState } from "react"
import type { TiktokAPIResponse } from "@tobyg74/tiktok-api-dl/lib/types/tiktokApi"

type ConvertArgument = {
  src: string
  className?: string
  alt?: string
}
const ConvertHeic = ({ src, className, alt }: ConvertArgument) => {
  const heic2any = require("heic2any")
  const [url, setUrl] = useState<string>(src)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    const get = async() => {
      try {
        const data = await fetch(src)
        const blob = await data.blob()
        const image = await heic2any({ blob })
        const url = URL.createObjectURL(image as Blob)
        setUrl(url)
      } catch {
      } finally {
        setIsLoading(false)
      }
    }
    get()
  }, [src, heic2any])
  return (<div>{isLoading ? (<div className="d-flex justify-content-center"><div className="spinner-grow" style={{ width: "3rem", height: "3rem"}} role="status">
          <span className="visually-hidden">Processing your image...</span>
        </div></div>) : 
      // eslint-disable-next-line @next/next/no-img-element
      <img className={className} src={url} alt={alt}/>
    }</div>)

}

export default function Home() {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min")
  }, [])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [url, setUrl] = useState<string>("")
  const [result, setResult] = useState<TiktokAPIResponse | null>(null)
  const onSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api?url=" + url)
      const data: TiktokAPIResponse = await response.json()
      if (data.status !== "success") throw Error()
      setResult(data)
    } catch {
      alert("Server error")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <main className="container" style={{ maxWidth: "680px"}}>
      <div className="text-center mt-5 mb-3">
        <h1>Tiktok Downloader</h1>
      </div>
      <form onSubmit={onSubmit}>
        <div className="d-flex">
        <div className="input-group mb-3 mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="https://vt.tiktok.com"
              aria-label="https://vt.tiktok.com"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {isLoading ?
            <button className="btn btn-outline-secondary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
          </button> : <div>
            <button className="btn btn-outline-primary" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
            </button>
          </div>}
        </div>
        </div>
      </form>

      {!!result ? 
      <div className="result">
        {result.result?.type === "video" ? 
        <div className="card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="img-fluid card-img-top" src={result.result.cover?.[0]} srcSet={result.result.cover?.[1]} alt="thumbnail" />
          <div className="card-body">
            <h5 className="card-title">{result.result.author.nickname}</h5>
            <p className="card-text">{result.result.description}</p>
            <div className="m-0">
            {result.result.video?.map((v, i) => {
              return (
              <a role="button" className="btn btn-danger mx-2" key={i} href={v} target="_blank" rel="noopener noreferrer" download={`tt.aqul.my.id_${result.result?.id}.mp4`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
              </a>
              )
            })}
            </div>
          </div>
        </div>
        : <div className="row row-cols-1 row-cols-md-2 g-4">
          {result.result?.images?.map((v, i) => {
            return (
              <div className="col" key={i}>
                <div className="card">
                  <ConvertHeic className="img-thumbnail card-img-center" src={v} alt="thumbnail" />
                </div>
              </div>
            )
          })}
        </div>
        }
      </div>
      : <></>}
    </main>
  )
}
