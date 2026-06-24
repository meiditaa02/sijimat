'use client'

import { useEffect } from 'react'

export default function RevealAnimation() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    reveals.forEach((el) => observer.observe(el))

    document.querySelectorAll('.stagger').forEach((parent) => {
      ;[...parent.children].forEach((child, i) => {
        child.style.setProperty('--i', i)
      })
    })

    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('nav a[href^="/#"]')
    const handleScroll = () => {
      let current = ''
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 100) current = sec.id
      })
      navLinks.forEach((link) => {
        link.style.color =
          link.getAttribute('href') === '/#' + current ? 'var(--accent-teal)' : ''
      })
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return null
}
