<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer>
    <div class="container is-fullhd content">
      <p class="bolder">
        Made by the
        <a href="https://manoa.hawaii.edu/"
          >University of Hawai&#699;i at M&#257;noa</a
        >
        and the
        <a href="https://www.snap.uaf.edu/"
          >Scenarios Network for Alaska + Arctic Planning</a
        >
        at the
        <a href="https://uaf-iarc.org">International Arctic Research Center</a>,
        <a href="https://www.uaf.edu/">University of Alaska Fairbanks</a>.
      </p>

      <p>
        Sponsored through a collaboration between the
        <a href="https://pi-casc.soest.hawaii.edu/"
          >Pacific Islands Climate Adaptation Science Center</a
        >
        and the
        <a href="https://akcasc.org/"
          >Alaska Climate Adaptation Science Center</a
        >, part of the
        <a href="https://www.usgs.gov/">U.S. Geological Survey</a> Climate
        Adaptation Science Center network. Thank you for helping make scientific
        data accessible and useful to the public!
      </p>

      <p>Thanks to Dr. Kristen Sanfilippo for guidance and expertise.</p>

      <p class="lighter">
        Please contact
        <a href="mailto:uaf-snap-data-tools@alaska.edu"
          >uaf-snap-data-tools@alaska.edu</a
        >
        with questions or comments.
      </p>

      <p class="legal">
        Copyright &copy; {{ year }} University of Alaska Fairbanks. All rights
        reserved. The
        <a href="https://www.alaska.edu/">University of Alaska</a> is an Equal
        Opportunity/Equal Access Employer and Educational Institution. The
        University is committed to a
        <a href="https://www.alaska.edu/nondiscrimination/"
          >policy of non-discrimination</a
        >
        against individuals on the basis of any legally protected status.
      </p>
    </div>
  </footer>
</template>

<style scoped>
footer {
  flex-shrink: 0;
  border-top: 1rem solid #64686a;
  background-color: #f6f9fc;
  color: #102030;
  padding: 3rem;

  font-size: 140%;
  font-weight: 500;
  line-height: 1.1;
}

footer .bolder {
  font-weight: 600;
}

footer .lighter {
  font-weight: 300;
  font-size: 90%;
}

.legal {
  font-weight: 400;
  font-size: 80%;
  line-height: 1.2;
}
</style>
